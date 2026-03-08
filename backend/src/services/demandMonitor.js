// Real-time demand monitoring with Socket.io
export const initializeDemandMonitoring = (io) => {
    const demandMetrics = new Map();
    
    // Monitor demand spikes every 30 seconds
    setInterval(() => {
        io.emit('demand-update', {
            timestamp: new Date().toISOString(),
            metrics: Array.from(demandMetrics.entries())
        });
    }, 30000);

    return {
        updateDemand: (productId, orderQuantity) => {
            const current = demandMetrics.get(productId) || { orders: 0, lastUpdate: Date.now() };
            demandMetrics.set(productId, {
                orders: current.orders + orderQuantity,
                lastUpdate: Date.now(),
                velocity: (current.orders + orderQuantity) / ((Date.now() - current.lastUpdate) / 60000) // orders per minute
            });
            
            // Emit immediate alert for surge detection
            const velocity = demandMetrics.get(productId).velocity;
            if (velocity > 5) { // 5+ orders per minute = surge
                io.emit('demand-surge', {
                    productId,
                    velocity,
                    alert: 'High demand surge detected',
                    timestamp: new Date().toISOString()
                });
            }
        }
    };
};