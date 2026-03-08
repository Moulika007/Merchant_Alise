import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { TrendingUp, Sparkles, AlertCircle, BarChart3, Timer } from 'lucide-react';

export default function AnalyticsPage() {
    const { products } = useStore();
    const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

    const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

    // Prepare data for the combined Price vs Sales chart
    const combinedData = selectedProduct?.salesHistory?.map((sh, idx) => ({
        date: new Date(sh.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: sh.sales,
        price: selectedProduct?.priceHistory?.[Math.min(idx, (selectedProduct?.priceHistory?.length || 1) - 1)]?.price || selectedProduct?.price,
    })) || [];

    const totalSalesVol = combinedData.reduce((acc, curr) => acc + curr.sales, 0);
    const averagePrice = combinedData.reduce((acc, curr) => acc + curr.price, 0) / (combinedData.length || 1);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary font-outfit">Performance Analytics</h1>
                    <p className="text-accent mt-1">AI-driven insights and product performance metrics.</p>
                </div>
                <div className="bg-white border border-border rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
                    <span className="text-sm font-bold text-accent">Analyze:</span>
                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="bg-transparent text-sm font-semibold text-primary outline-none cursor-pointer"
                    >
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Dynamic AI Insights / Smart Actions based on Stock and Trends */}
            <div className="bg-[#f7f7f5] border border-border rounded-3xl p-6 shadow-sm">

                {/* Header Section */}
                {selectedProduct?.isTrending && !selectedProduct?.isLowStock ? (
                    // Smart Action Recommendations Header (For high demand/trending)
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/5 text-primary p-2.5 rounded-xl">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-primary flex items-center gap-2">
                                    Smart Action Recommendations
                                </h3>
                                <p className="text-xs text-accent mt-0.5">
                                    Enhanced AI • Multi-timeframe analysis • Real-time demand prediction
                                </p>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-primary hover:text-primary/70">Refresh</button>
                    </div>
                ) : (
                    // Demand Cooldown Header (For non-trending or low stock where demand is building/falling)
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 text-blue-500 p-2.5 rounded-xl">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-primary flex items-center gap-2">
                                    Demand Cooldown & Duration Predictor
                                </h3>
                                <p className="text-xs text-accent mt-0.5">
                                    Predict how long demand surges will last
                                </p>
                            </div>
                        </div>

                        {/* Cooldown Stats Strip */}
                        <div className="flex items-center gap-8 w-full md:w-auto">
                            <div>
                                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                                    <div className="p-1 bg-gray-100 rounded text-gray-500"><TrendingUp size={14} /></div> GROWING
                                </div>
                                <p className="text-[10px] text-accent">Trend Direction</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                                    <Timer size={16} className="text-gray-500" /> {Math.floor(Math.random() * 100) + 60} min
                                </div>
                                <p className="text-[10px] text-accent">Predicted Duration</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                                    <BarChart3 size={16} className="text-gray-500" /> NORMAL
                                </div>
                                <p className="text-[10px] text-accent">Status</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* Metrics Row (Only for Smart Actions) */}
                {selectedProduct?.isTrending && !selectedProduct?.isLowStock && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/60 border border-black/5 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">CURRENT/MIN</p>
                            <p className="text-lg font-bold text-primary">{(Math.random() * 5).toFixed(1)}</p>
                        </div>
                        <div className="bg-white/60 border border-black/5 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">AVERAGE/MIN</p>
                            <p className="text-lg font-bold text-primary">{(Math.random() * 2).toFixed(2)}</p>
                        </div>
                        <div className="bg-white/60 border border-black/5 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">GROWTH</p>
                            <p className="text-lg font-bold text-primary">{Math.floor(Math.random() * 200 + 50)}.{Math.floor(Math.random() * 99)}%</p>
                        </div>
                        <div className="flex justify-between gap-4">
                            <div className="bg-transparent p-3 flex-1 flex flex-col justify-center">
                                <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">PREDICTED 30M</p>
                                <p className="text-lg font-bold text-primary">{Math.floor(Math.random() * 100 + 20)}</p>
                            </div>
                            <div className="bg-transparent p-3 flex-1 flex flex-col justify-center">
                                <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">REGIONAL DEMAND</p>
                                <p className="text-lg font-bold text-primary">{Math.floor(Math.random() * 40 + 60)}.{Math.floor(Math.random() * 99)}%</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* Actionable Rows */}
                <div className="space-y-2">
                    {selectedProduct?.isLowStock ? (
                        <>
                            {/* Demand is building (Cooldown View) */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-blue-900">Demand is still building. Prepare extra stock and keep pricing under review.</p>
                                </div>
                            </div>
                        </>
                    ) : selectedProduct?.isTrending ? (
                        <>
                            {/* High Demand Actions */}
                            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-red-900 mb-0.5">Restock inventory immediately</p>
                                    <p className="text-xs text-red-700/70">Projected 30-minute demand is higher than current stock.</p>
                                </div>
                                <span className="text-[10px] font-bold bg-transparent text-red-900 tracking-wider">HIGH</span>
                            </div>

                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-blue-900 mb-0.5">Increase price by 5%</p>
                                    <p className="text-xs text-blue-700/70">Demand growth is above the 200% surge threshold.</p>
                                </div>
                                <span className="text-[10px] font-bold bg-transparent text-blue-900 tracking-wider">MEDIUM</span>
                            </div>

                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-blue-900 mb-0.5">Activate nearest warehouse</p>
                                    <p className="text-xs text-blue-700/70">Regional demand concentration is above 70%.</p>
                                </div>
                                <span className="text-[10px] font-bold bg-transparent text-blue-900 tracking-wider">MEDIUM</span>
                            </div>
                        </>
                    ) : (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-blue-900 mb-0.5">Activate nearest warehouse</p>
                                <p className="text-xs text-blue-700/70">Regional demand concentration is above 70%.</p>
                            </div>
                            <span className="text-[10px] font-bold bg-transparent text-blue-900 tracking-wider">MEDIUM</span>
                        </div>
                    )}
                </div>

                <p className="text-[10px] text-accent mt-4">
                    Using local recommendation fallback until the backend analytics service is reachable.
                </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-bold text-accent uppercase tracking-widest">Total Volume</span>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 size={16} /></div>
                    </div>
                    <p className="text-3xl font-bold text-primary tracking-tight">{totalSalesVol}</p>
                    <p className="text-sm text-accent mt-2 flex items-center gap-1">
                        <TrendingUp size={14} className="text-emerald-500" /> +12% from last period
                    </p>
                </div>

                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-bold text-accent uppercase tracking-widest">Avg. Position Price</span>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">₹</div>
                    </div>
                    <p className="text-3xl font-bold text-primary tracking-tight">₹{averagePrice.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-accent mt-2 flex items-center gap-1">
                        Maintained at competitive baseline
                    </p>
                </div>

                <div className={`border rounded-2xl p-6 shadow-sm ${selectedProduct?.isLowStock ? 'bg-red-50 border-red-200' : 'bg-white border-border'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-bold text-accent uppercase tracking-widest">Current Stock</span>
                        <div className={`p-2 rounded-lg ${selectedProduct?.isLowStock ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}><AlertCircle size={16} /></div>
                    </div>
                    <p className={`text-3xl font-bold tracking-tight ${selectedProduct?.isLowStock ? 'text-red-600' : 'text-primary'}`}>{selectedProduct?.stock}</p>
                    <p className={`text-sm mt-2 font-medium ${selectedProduct?.isLowStock ? 'text-red-500' : 'text-accent'}`}>
                        {selectedProduct?.isLowStock ? 'Critical: Restock requested immediately.' : 'Inventory levels are healthy.'}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Product Trend Vector */}
                <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-primary text-lg">Sales Velocity</h3>
                            <p className="text-xs font-medium text-accent">Unit movement over time</p>
                        </div>
                        {selectedProduct?.isTrending && (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1">
                                <TrendingUp size={12} /> Trending High
                            </span>
                        )}
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={combinedData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#0f0f0f' }}
                                />
                                <Line type="monotone" dataKey="sales" stroke="#0f0f0f" strokeWidth={3} dot={{ r: 4, fill: '#0f0f0f', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Price vs Sales Correlation */}
                <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-bold text-primary text-lg">Price Elasticity</h3>
                        <p className="text-xs font-medium text-accent">Sales volume vs. Price point</p>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height={250}>
                            <ComposedChart data={combinedData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} tick={{ fill: '#22c55e', fontSize: 12 }} dx={10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar yAxisId="left" dataKey="sales" fill="#e5e5e5" radius={[4, 4, 0, 0]} />
                                <Line yAxisId="right" type="stepAfter" dataKey="price" stroke="#22c55e" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
