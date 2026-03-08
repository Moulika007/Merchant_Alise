export interface Review {
    user: string;
    text: string;
    rating: number;
    date: string;
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    rating: number;
    image: string;
    images?: string[];
    sizes?: string[];
    reviews?: Review[];
    discount?: number;
    tag?: string;
    category: string;
    subcategory: string;
    description: string;
    stock: number;
    isTrending: boolean;
    isLowStock: boolean;
    salesHistory: { date: string; sales: number }[];
    priceHistory: { date: string; price: number }[];
    aiInsights: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: 'buyer' | 'seller';
}

export const mockCategories = [
    {
        name: "Computers & Tech",
        subcategories: ["Laptops", "Smartphones", "Audio", "Accessories"]
    },
    {
        name: "Home & Kitchen",
        subcategories: ["Small Appliances", "Decor", "Furniture", "Lighting"]
    },
    {
        name: "Fashion",
        subcategories: ["Men's Clothing", "Women's Clothing", "Sneakers", "Watches"]
    },
    {
        name: "Books & Study",
        subcategories: ["Non-Fiction", "Productivity", "Stationery", "Desk Setup"]
    },
    {
        name: "Fitness",
        subcategories: ["Yoga Mats", "Dumbbells", "Supplements", "Wearables"]
    }
];

// Seed data with INR pricing and analytics fields
export const initialProducts: Product[] = [
    {
        id: "p1",
        name: "M2 Pro Performance Laptop space gray",
        brand: "TechNova",
        price: 185000,
        discount: 0,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800"
        ],
        sizes: ["14-inch", "16-inch"],
        reviews: [
            { user: "Alex M.", text: "Incredible battery life and compiling speed.", rating: 5, date: "2024-02-15" }
        ],
        tag: "Bestseller",
        category: "Computers & Tech",
        subcategory: "Laptops",
        description: "The ultimate workstation for professionals. Features unparalleled battery life and processing performance. The M2 Pro chip brings power and efficiency.",
        stock: 45,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-01-01', sales: 12 }, { date: '2024-01-08', sales: 15 }, { date: '2024-01-15', sales: 22 }],
        priceHistory: [{ date: '2024-01-01', price: 195000 }, { date: '2024-01-15', price: 185000 }],
        aiInsights: "Price drop of ₹10,000 resulted in a 46% increase in weekly sales volume. Maintain current pricing."
    },
    {
        id: "p2",
        name: "Minimalist Ergonomic Chair",
        brand: "ErgoSpace",
        price: 24900,
        discount: 15,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800"
        ],
        sizes: ["Standard"],
        reviews: [
            { user: "Sarah K.", text: "Saved my back during long WFH hours. Very stylish.", rating: 5, date: "2024-01-20" },
            { user: "John D.", text: "Good build quality, setup took 20 mins.", rating: 4, date: "2024-02-05" }
        ],
        tag: "Premium",
        category: "Home & Kitchen",
        subcategory: "Furniture",
        description: "Award-winning ergonomic design that supports your posture through long work sessions. Breathable mesh and adjustable lumbar.",
        stock: 8,
        isTrending: false,
        isLowStock: true,
        salesHistory: [{ date: '2024-01-01', sales: 5 }, { date: '2024-01-08', sales: 3 }, { date: '2024-01-15', sales: 8 }],
        priceHistory: [{ date: '2024-01-01', price: 24900 }, { date: '2024-01-15', price: 24900 }],
        aiInsights: "Stock is critically low (8 remaining). Restock soon to prevent missed sales opportunities."
    },
    {
        id: "p3",
        name: "Noise-Cancelling Studio Headphones",
        brand: "SonicAura",
        price: 29500,
        discount: 0,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
        ],
        sizes: ["One Size"],
        reviews: [
            { user: "Emma W.", text: "ANC is top tier, and battery lasts days.", rating: 5, date: "2024-03-01" }
        ],
        tag: "Trending",
        category: "Computers & Tech",
        subcategory: "Audio",
        description: "Industry-leading active noise cancellation for pure audio immersion. 40-hour battery life with USB-C fast charging.",
        stock: 120,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-01-01', sales: 30 }, { date: '2024-01-08', sales: 45 }, { date: '2024-01-15', sales: 65 }],
        priceHistory: [{ date: '2024-01-01', price: 32000 }, { date: '2024-01-15', price: 29500 }],
        aiInsights: "Highly trending item! Consider bundling with audio accessories to increase Average Order Value."
    },
    {
        id: "p4",
        name: "Ceramic Pour-Over Coffee Maker",
        brand: "BrewArt",
        price: 4500,
        discount: 10,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800"
        ],
        sizes: ["0.5L", "1.0L"],
        reviews: [],
        category: "Home & Kitchen",
        subcategory: "Small Appliances",
        description: "Elevate your morning routine with this beautifully crafted ceramic coffee maker.",
        stock: 35,
        isTrending: false,
        isLowStock: false,
        salesHistory: [{ date: '2024-01-01', sales: 8 }, { date: '2024-01-08', sales: 6 }, { date: '2024-01-15', sales: 10 }],
        priceHistory: [{ date: '2024-01-01', price: 4500 }, { date: '2024-01-15', price: 4500 }],
        aiInsights: "Steady sales. Feature in an upcoming 'Morning Routine' promotional campaign."
    },
    // --- More Home & Kitchen ---
    {
        id: "p13",
        name: "Handwoven Jute Rug",
        brand: "EarthyHome",
        price: 8500,
        discount: 0,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1575414003593-eea4025d2ea6?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1575414003593-eea4025d2ea6?auto=format&fit=crop&q=80&w=800"],
        sizes: ["4x6 ft", "5x8 ft"],
        reviews: [{ user: "Julia M.", text: "Beautiful texture, ties the room together.", rating: 5, date: "2024-02-12" }],
        tag: "Trending",
        category: "Home & Kitchen",
        subcategory: "Decor",
        description: "A sustainable and durable handwoven jute rug that brings natural warmth to any living space.",
        stock: 45,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-01', sales: 22 }, { date: '2024-02-08', sales: 30 }],
        priceHistory: [{ date: '2024-01-01', price: 8500 }],
        aiInsights: "Strong organic growth driven by search trends for sustainable decor."
    },
    {
        id: "p14",
        name: "Mid-Century Modern Pendant Light",
        brand: "Lumiere",
        price: 12900,
        discount: 10,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Standard"],
        reviews: [{ user: "David S.", text: "Stunning statement piece over our dining table.", rating: 5, date: "2024-03-01" }],
        tag: "Premium",
        category: "Home & Kitchen",
        subcategory: "Lighting",
        description: "A striking brass and matte black pendant light that perfectly captures the mid-century modern aesthetic.",
        stock: 12,
        isTrending: false,
        isLowStock: true,
        salesHistory: [{ date: '2024-02-15', sales: 5 }, { date: '2024-02-28', sales: 8 }],
        priceHistory: [{ date: '2024-01-15', price: 14500 }, { date: '2024-02-15', price: 12900 }],
        aiInsights: "Recent discount sparked interest. Stock is getting low."
    },
    {
        id: "p15",
        name: "Smart Air Purifier HEPA 13",
        brand: "PureAir",
        price: 18500,
        discount: 5,
        rating: 4.7,
        image: "/products/smart_air_purifier_hepa_13.jpg",
        images: ["/products/smart_air_purifier_hepa_13.jpg"],
        sizes: ["Standard", "Large Room"],
        reviews: [{ user: "Kevin B.", text: "Allergies instantly better. App is very responsive.", rating: 5, date: "2024-02-28" }],
        tag: "Bestseller",
        category: "Home & Kitchen",
        subcategory: "Small Appliances",
        description: "A high-efficiency smart air purifier that removes 99.97% of airborne particles. Controllable via the companion app.",
        stock: 65,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-15', sales: 40 }, { date: '2024-03-01', sales: 60 }],
        priceHistory: [{ date: '2024-01-01', price: 19500 }, { date: '2024-02-15', price: 18500 }],
        aiInsights: "Seasonal allergy trends are driving high volume sales. Increase targeted ad spend."
    },
    {
        id: "p16",
        name: "Solid Oak Floating Shelves (Set of 2)",
        brand: "TimberCraft",
        price: 6500,
        discount: 0,
        rating: 4.6,
        image: "/products/solid_oak_floating_shelves__set_of_2_.jpg",
        images: ["/products/solid_oak_floating_shelves__set_of_2_.jpg"],
        sizes: ["24-inch", "36-inch"],
        reviews: [{ user: "Amanda W.", text: "High quality wood and easy to install.", rating: 4, date: "2024-02-05" }],
        tag: "Essential",
        category: "Home & Kitchen",
        subcategory: "Furniture",
        description: "Minimalist solid oak floating shelves with hidden steel brackets for a clean, floating look.",
        stock: 150,
        isTrending: false,
        isLowStock: false,
        salesHistory: [{ date: '2024-01-15', sales: 30 }, { date: '2024-02-15', sales: 42 }],
        priceHistory: [{ date: '2024-01-01', price: 6500 }],
        aiInsights: "Consistent seller. Good candidate for cross-selling with Decor items."
    },
    {
        id: "p5",
        name: "Matte Black Smart Watch",
        brand: "VitaTrack",
        price: 19999,
        discount: 0,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800"
        ],
        sizes: ["40mm", "44mm"],
        reviews: [
            { user: "Leo", text: "Great battery life.", rating: 5, date: "2024-02-18" }
        ],
        category: "Fitness",
        subcategory: "Wearables",
        description: "Track your health metrics and stay connected with this sleek smartwatch.",
        stock: 5,
        isTrending: false,
        isLowStock: true,
        salesHistory: [{ date: '2024-01-01', sales: 15 }, { date: '2024-01-08', sales: 10 }, { date: '2024-01-15', sales: 2 }],
        priceHistory: [{ date: '2024-01-01', price: 18000 }, { date: '2024-01-15', price: 19999 }],
        aiInsights: "Recent price increase severely impacted sales volume. Revert to ₹18,000 to stimulate demand."
    },
    {
        id: "p6",
        name: "Aesthetic Desk Mat & Organizer",
        brand: "Workspace",
        price: 2499,
        discount: 0,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Standard", "Large"],
        reviews: [
            { user: "Chris", text: "Fit is perfect. Quality material.", rating: 5, date: "2024-02-22" }
        ],
        tag: "Viral",
        category: "Books & Study",
        subcategory: "Desk Setup",
        description: "Premium vegan leather desk mat that protects your workspace while looking incredibly clean.",
        stock: 250,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-01-01', sales: 50 }, { date: '2024-01-08', sales: 120 }, { date: '2024-01-15', sales: 210 }],
        priceHistory: [{ date: '2024-01-01', price: 2499 }, { date: '2024-01-15', price: 2499 }],
        aiInsights: "Product went viral on social media. Ensure supply chain can handle 300% projected growth next month."
    },
    // --- Smartphones ---
    {
        id: "p7",
        name: "Zenith Pro Max Smartphone",
        brand: "TechNova",
        price: 99999,
        discount: 5,
        rating: 4.8,
        image: "/products/zenith_pro_max_smartphone.jpg",
        images: ["/products/zenith_pro_max_smartphone.jpg"],
        sizes: ["128GB", "256GB"],
        reviews: [{ user: "Mike T.", text: "Stunning display and great camera.", rating: 5, date: "2024-03-05" }],
        tag: "Bestseller",
        category: "Computers & Tech",
        subcategory: "Smartphones",
        description: "The latest flagship smartphone with a 120Hz OLED display, versatile triple-camera system, and all-day battery life.",
        stock: 50,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-03-01', sales: 40 }, { date: '2024-03-05', sales: 55 }],
        priceHistory: [{ date: '2024-02-01', price: 105000 }, { date: '2024-03-01', price: 99999 }],
        aiInsights: "Strong initial sales for the new flagship."
    },
    {
        id: "p8",
        name: "Lumina Fold 3G",
        brand: "FutureTech",
        price: 135000,
        discount: 0,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&q=80&w=800"],
        sizes: ["256GB", "512GB"],
        reviews: [{ user: "Anna C.", text: "The folding screen is a game-changer.", rating: 5, date: "2024-02-28" }],
        tag: "New",
        category: "Computers & Tech",
        subcategory: "Smartphones",
        description: "Experience the future with a seamless folding display, incredibly thin design, and flagship performance.",
        stock: 15,
        isTrending: false,
        isLowStock: true,
        salesHistory: [{ date: '2024-02-25', sales: 5 }, { date: '2024-03-02', sales: 10 }],
        priceHistory: [{ date: '2024-02-25', price: 135000 }],
        aiInsights: "High interest but low conversion due to premium price point."
    },
    {
        id: "p9",
        name: "EcoPhone Lite",
        brand: "GreenTech",
        price: 24999,
        discount: 10,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800"],
        sizes: ["64GB", "128GB"],
        reviews: [{ user: "Dave R.", text: "Great value for money.", rating: 4, date: "2024-03-01" }],
        tag: "Value",
        category: "Computers & Tech",
        subcategory: "Smartphones",
        description: "An eco-friendly smartphone made from recycled materials without compromising on essential features.",
        stock: 120,
        isTrending: false,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-15', sales: 20 }, { date: '2024-03-01', sales: 25 }],
        priceHistory: [{ date: '2024-02-15', price: 27500 }, { date: '2024-03-01', price: 24999 }],
        aiInsights: "Consistent performer in the budget segment."
    },
    // --- Accessories ---
    {
        id: "p10",
        name: "Magnetic Wireless Charger 3-in-1",
        brand: "ChargeMate",
        price: 3999,
        discount: 20,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=800"],
        sizes: ["One Size"],
        reviews: [{ user: "Sam H.", text: "Charges all my devices perfectly at night.", rating: 5, date: "2024-02-20" }],
        tag: "Trending",
        category: "Computers & Tech",
        subcategory: "Accessories",
        description: "Simultaneously charge your phone, smartwatch, and wireless earbuds with this sleek, space-saving magnetic stand.",
        stock: 80,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-01', sales: 60 }, { date: '2024-02-15', sales: 85 }],
        priceHistory: [{ date: '2024-01-01', price: 4999 }, { date: '2024-02-01', price: 3999 }],
        aiInsights: "Recent discount boosted sales significantly. Keep promotion running."
    },
    {
        id: "p11",
        name: "Premium Leather Laptop Sleeve",
        brand: "CraftGoods",
        price: 5499,
        discount: 0,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800"],
        sizes: ["13-inch", "14-inch", "16-inch"],
        reviews: [{ user: "Rachel G.", text: "Smells great, feels premium. Protects my laptop well.", rating: 5, date: "2024-03-02" }],
        tag: "Premium",
        category: "Computers & Tech",
        subcategory: "Accessories",
        description: "Handcrafted from full-grain leather. This sleeve develops a beautiful patina over time while keeping your tech safe.",
        stock: 25,
        isTrending: false,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-10', sales: 15 }, { date: '2024-03-01', sales: 12 }],
        priceHistory: [{ date: '2024-01-01', price: 5499 }],
        aiInsights: "Steady niche product with high customer satisfaction."
    },
    {
        id: "p12",
        name: "Pro 7-Port USB-C Hub",
        brand: "ConnectTech",
        price: 2999,
        discount: 0,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1625895197185-efcec01cffe0?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Standard"],
        reviews: [{ user: "Tom K.", text: "All the ports I need. Does get a bit warm.", rating: 4, date: "2024-02-18" }],
        tag: "Essential",
        category: "Computers & Tech",
        subcategory: "Accessories",
        description: "Expand your connectivity with HDMI, SD card reader, ethernet, and multiple USB-A and USB-C ports.",
        stock: 200,
        isTrending: false,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-01', sales: 150 }, { date: '2024-03-01', sales: 140 }],
        priceHistory: [{ date: '2024-01-01', price: 2999 }],
        aiInsights: "High volume staple product. Consider bundling with laptops."
    },
    // --- Fashion ---
    {
        id: "p17",
        name: "Classic Oxford Cotton Shirt",
        brand: "ThreadWorks",
        price: 2499,
        discount: 0,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800"],
        sizes: ["S", "M", "L", "XL"],
        reviews: [{ user: "James O.", text: "Perfect fit and very breathable.", rating: 5, date: "2024-03-05" }],
        tag: "Essential",
        category: "Fashion",
        subcategory: "Men's Clothing",
        description: "A tailored, breathable cotton Oxford shirt perfect for both office wear and casual weekends.",
        stock: 120,
        isTrending: false,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-10', sales: 40 }, { date: '2024-03-01', sales: 35 }],
        priceHistory: [{ date: '2024-01-01', price: 2499 }],
        aiInsights: "A stable staple product. Keep in stock."
    },
    {
        id: "p18",
        name: "Linen Blend Summer Dress",
        brand: "Aura",
        price: 3200,
        discount: 15,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&q=80&w=800"],
        sizes: ["XS", "S", "M", "L"],
        reviews: [{ user: "Sophia R.", text: "So light and airy. Got so many compliments!", rating: 5, date: "2024-03-02" }],
        tag: "Trending",
        category: "Fashion",
        subcategory: "Women's Clothing",
        description: "A flowy, lightweight linen-blend dress with a subtle floral pattern, perfect for warm weather.",
        stock: 50,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-20', sales: 30 }, { date: '2024-03-05', sales: 55 }],
        priceHistory: [{ date: '2024-02-01', price: 3765 }, { date: '2024-03-01', price: 3200 }],
        aiInsights: "Trending up as the season changes. Promote aggressively."
    },
    {
        id: "p19",
        name: "Urban Runner X1",
        brand: "Stride",
        price: 8999,
        discount: 0,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"],
        sizes: ["US 8", "US 9", "US 10", "US 11"],
        reviews: [{ user: "Marcus T.", text: "Incredibly comfortable for daily wear.", rating: 4, date: "2024-02-28" }],
        tag: "Bestseller",
        category: "Fashion",
        subcategory: "Sneakers",
        description: "Lightweight, responsive cushioning combined with a sleek urban design for all-day comfort.",
        stock: 30,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-15', sales: 60 }, { date: '2024-03-01', sales: 45 }],
        priceHistory: [{ date: '2024-01-01', price: 8999 }],
        aiInsights: "Popular colorway. Suggest manufacturing expansion."
    },
    {
        id: "p20",
        name: "Minimalist Chronograph",
        brand: "Tempo",
        price: 15500,
        discount: 10,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"],
        sizes: ["One Size"],
        reviews: [{ user: "Elena V.", text: "Elegant and sophisticated. Goes with everything.", rating: 5, date: "2024-02-25" }],
        tag: "Premium",
        category: "Fashion",
        subcategory: "Watches",
        description: "A stunning minimalist chronograph watch featuring a matte dial, sleek hour markers, and a premium leather strap.",
        stock: 8,
        isTrending: false,
        isLowStock: true,
        salesHistory: [{ date: '2024-02-05', sales: 12 }, { date: '2024-03-01', sales: 8 }],
        priceHistory: [{ date: '2024-01-15', price: 17200 }, { date: '2024-03-01', price: 15500 }],
        aiInsights: "Low stock alert. Replenishment needed to maintain sales."
    },
    // --- Books & Study ---
    {
        id: "p21",
        name: "Atomic Habits (Hardcover)",
        brand: "Penguin Random House",
        price: 599,
        discount: 20,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Standard"],
        reviews: [{ user: "Chris L.", text: "Life-changing book on building habits.", rating: 5, date: "2024-01-15" }],
        tag: "Bestseller",
        category: "Books & Study",
        subcategory: "Non-Fiction",
        description: "An easy and proven way to build good habits and break bad ones. Essential reading for personal development.",
        stock: 500,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-01', sales: 120 }, { date: '2024-03-01', sales: 150 }],
        priceHistory: [{ date: '2024-01-01', price: 750 }, { date: '2024-03-01', price: 599 }],
        aiInsights: "Consistent high volume seller. Ideal for bundle promotions."
    },
    {
        id: "p22",
        name: "Premium Dot Grid Notebook",
        brand: "Leuchtturm1917",
        price: 1850,
        discount: 0,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"],
        sizes: ["A5"],
        reviews: [{ user: "Sarah P.", text: "Perfect paper quality for fountain pens. No ghosting.", rating: 5, date: "2024-02-20" }],
        tag: "Premium",
        category: "Books & Study",
        subcategory: "Productivity",
        description: "The ultimate notebook for bullet journaling. Features numbered pages, blank table of contents, and 80g/sqm paper.",
        stock: 150,
        isTrending: false,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-10', sales: 45 }, { date: '2024-03-01', sales: 50 }],
        priceHistory: [{ date: '2024-01-01', price: 1850 }],
        aiInsights: "Strong brand loyalty. Recommended stocking up before back-to-school seasons."
    },
    {
        id: "p23",
        name: "Minimalist Brass Pen",
        brand: "CraftDesign",
        price: 2450,
        discount: 10,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Standard"],
        reviews: [{ user: "Mark D.", text: "Heavy, balanced, and writes incredibly smooth.", rating: 5, date: "2024-02-28" }],
        tag: "Essential",
        category: "Books & Study",
        subcategory: "Stationery",
        description: "A precision-machined solid brass pen that patinas beautifully over time and uses standard G2 ink cartridges.",
        stock: 45,
        isTrending: true,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-15', sales: 25 }, { date: '2024-03-01', sales: 30 }],
        priceHistory: [{ date: '2024-01-15', price: 2700 }, { date: '2024-03-01', price: 2450 }],
        aiInsights: "Trending gift item for professionals. Maintain current discount."
    },
    {
        id: "p24",
        name: "Adjustable Laptop Stand",
        brand: "ErgoGear",
        price: 3500,
        discount: 0,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800",
        images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Universal"],
        reviews: [{ user: "Lisa M.", text: "Saved my neck! Very sturdy aluminum build.", rating: 4, date: "2024-02-10" }],
        tag: "Ergonomic",
        category: "Books & Study",
        subcategory: "Desk Setup",
        description: "Premium aluminum laptop stand that elevates your screen to eye level for better ergonomics and cooling.",
        stock: 85,
        isTrending: false,
        isLowStock: false,
        salesHistory: [{ date: '2024-02-05', sales: 40 }, { date: '2024-03-01', sales: 35 }],
        priceHistory: [{ date: '2024-01-01', price: 3500 }],
        aiInsights: "Steady performer in home office setups. Consider bundling with keyboards."
    },
    // --- Additional Computers & Tech ---
    {
        id: "p25", name: "Ergonomic Wireless Mouse", brand: "ClickMaster", price: 2999, discount: 10, rating: 4.8,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Standard"], reviews: [], tag: "Essential", category: "Computers & Tech", subcategory: "Accessories",
        description: "Vertical wireless mouse to prevent wrist strain.", stock: 200, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p26", name: "Ultra-Wide Gaming Monitor", brand: "VisionX", price: 45000, discount: 5, rating: 4.9,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800"],
        sizes: ["34-inch"], reviews: [], tag: "Premium", category: "Computers & Tech", subcategory: "Accessories",
        description: "Immersive curved monitor with 144Hz refresh rate.", stock: 15, isTrending: true, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p27", name: "Velocity Series Laptop", brand: "TechNova", price: 75000, discount: 0, rating: 4.5,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800"],
        sizes: ["15-inch"], reviews: [], category: "Computers & Tech", subcategory: "Laptops",
        description: "A fast, lightweight laptop suitable for students and travelers.", stock: 35, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p28", name: "ClearSound Bluetooth Speaker", brand: "SonicAura", price: 6500, discount: 15, rating: 4.6,
        image: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Portable"], reviews: [], tag: "Bestseller", category: "Computers & Tech", subcategory: "Audio",
        description: "Waterproof bluetooth speaker with deep bass.", stock: 110, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p29", name: "Nova X Budget Phone", brand: "FutureTech", price: 15000, discount: 0, rating: 4.2,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800"],
        sizes: ["64GB"], reviews: [], category: "Computers & Tech", subcategory: "Smartphones",
        description: "Reliable smartphone with a large battery for all-day use.", stock: 300, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },

    // --- Additional Home & Kitchen ---
    {
        id: "p30", name: "Barista Pro Espresso Machine", brand: "BrewArt", price: 42000, discount: 5, rating: 4.9,
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Standard"], reviews: [], tag: "Premium", category: "Home & Kitchen", subcategory: "Small Appliances",
        description: "Semi-automatic espresso machine with built-in grinder.", stock: 12, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p31", name: "Velvet Throw Pillow", brand: "LuxeHome", price: 1200, discount: 0, rating: 4.7,
        image: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&q=80&w=800"],
        sizes: ["18x18"], reviews: [], category: "Home & Kitchen", subcategory: "Decor",
        description: "Plush velvet throw pillow available in multiple colors.", stock: 80, isTrending: true, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p32", name: "Minimalist Coffee Table", brand: "ModernSpace", price: 12500, discount: 10, rating: 4.5,
        image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800"],
        sizes: ["One Size"], reviews: [], tag: "Trending", category: "Home & Kitchen", subcategory: "Furniture",
        description: "Sleek glass and wood coffee table for modern living rooms.", stock: 25, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p33", name: "Smart LED Bulb 4-Pack", brand: "Lumiere", price: 3500, discount: 0, rating: 4.6,
        image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800"],
        sizes: ["E26"], reviews: [], tag: "Essential", category: "Home & Kitchen", subcategory: "Lighting",
        description: "Color-changing smart bulbs compatible with Alexa and Google Home.", stock: 150, isTrending: true, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p34", name: "Ceramic Modern Vase", brand: "EarthyHome", price: 2100, discount: 0, rating: 4.8,
        image: "https://images.unsplash.com/photo-1612196808214-b7e239e5b5a7?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1612196808214-b7e239e5b5a7?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Medium"], reviews: [], category: "Home & Kitchen", subcategory: "Decor",
        description: "Matte ceramic vase, perfect for dried flowers or Pampas grass.", stock: 40, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },

    // --- Additional Fashion ---
    {
        id: "p35", name: "Vintage Wash Denim Jacket", brand: "ThreadWorks", price: 4999, discount: 15, rating: 4.7,
        image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1601333144130-8cbb312386b6?auto=format&fit=crop&q=80&w=800"],
        sizes: ["S", "M", "L", "XL"], reviews: [], tag: "Bestseller", category: "Fashion", subcategory: "Men's Clothing",
        description: "Classic denim jacket with a comfortable, slightly oversized fit.", stock: 65, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p36", name: "Midi Pleated Skirt", brand: "Aura", price: 2800, discount: 0, rating: 4.6,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=800"],
        sizes: ["XS", "S", "M", "L"], reviews: [], category: "Fashion", subcategory: "Women's Clothing",
        description: "Versatile pleated skirt that can be dressed up or down.", stock: 55, isTrending: true, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p37", name: "CloudFoam Running Shoes", brand: "Stride", price: 7500, discount: 10, rating: 4.8,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"],
        sizes: ["8", "9", "10", "11"], reviews: [], tag: "Essential", category: "Fashion", subcategory: "Sneakers",
        description: "Super light running shoes designed for marathon training.", stock: 80, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p38", name: "Automatic Diver's Watch", brand: "Tempo", price: 35000, discount: 0, rating: 4.9,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800"],
        sizes: ["One Size"], reviews: [], tag: "Premium", category: "Fashion", subcategory: "Watches",
        description: "A robust stainless steel diver's watch with 200m water resistance.", stock: 10, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p39", name: "Heavyweight Boxy Tee", brand: "ThreadWorks", price: 1299, discount: 0, rating: 4.5,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"],
        sizes: ["S", "M", "L", "XL"], reviews: [], category: "Fashion", subcategory: "Men's Clothing",
        description: "Premium thick cotton tee with a modern boxy silhouette.", stock: 200, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },

    // --- Additional Books & Study ---
    {
        id: "p40", name: "Deep Work (Paperback)", brand: "Grand Central Publishing", price: 450, discount: 5, rating: 4.7,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Standard"], reviews: [], category: "Books & Study", subcategory: "Non-Fiction",
        description: "Rules for focused success in a distracted world.", stock: 150, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p41", name: "Undated Weekly Planner", brand: "Leuchtturm1917", price: 2100, discount: 0, rating: 4.8,
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800"],
        sizes: ["A5"], reviews: [], tag: "Trending", category: "Books & Study", subcategory: "Productivity",
        description: "Start organizing your life at any time of the year.", stock: 80, isTrending: true, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p42", name: "Premium Gel Pens (Set of 12)", brand: "CraftDesign", price: 850, discount: 15, rating: 4.6,
        image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800"],
        sizes: ["0.5mm"], reviews: [], category: "Books & Study", subcategory: "Stationery",
        description: "Smooth writing gel pens in an array of classic colors.", stock: 300, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p43", name: "Architect LED Desk Lamp", brand: "Lumiere", price: 4200, discount: 0, rating: 4.8,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Standard"], reviews: [], tag: "Premium", category: "Books & Study", subcategory: "Desk Setup",
        description: "Adjustable color temperature desk lamp with wireless charging base.", stock: 45, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p44", name: "Wool Felt Desk Pad", brand: "ErgoGear", price: 1800, discount: 0, rating: 4.5,
        image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Extra Large"], reviews: [], category: "Books & Study", subcategory: "Desk Setup",
        description: "Warm, comfortable, and stylish mat that protects your desk surface.", stock: 120, isTrending: true, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },

    // --- Additional Fitness ---
    {
        id: "p45", name: "Pro Grip Yoga Mat", brand: "Zenith", price: 4500, discount: 10, rating: 4.9,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Standard", "Extra Long"], reviews: [], tag: "Bestseller", category: "Fitness", subcategory: "Yoga Mats",
        description: "Non-slip polyurethane mat designed for extreme grip even during hot yoga.", stock: 90, isTrending: true, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p46", name: "Adjustable Smart Dumbbells", brand: "IronGrip", price: 18000, discount: 5, rating: 4.8,
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Up to 24kg"], reviews: [], tag: "Premium", category: "Fitness", subcategory: "Dumbbells",
        description: "Space-saving dumbbell system that adjusts from 2kg to 24kg in seconds.", stock: 20, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p47", name: "Whey Protein Isolate", brand: "OptimumNutrition", price: 6500, discount: 0, rating: 4.7,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800"],
        sizes: ["2kg Tub"], reviews: [], tag: "Essential", category: "Fitness", subcategory: "Supplements",
        description: "Fast-digesting whey isolate to aid muscle recovery.", stock: 150, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p48", name: "Fitness Tracker Core", brand: "VitaTrack", price: 4999, discount: 15, rating: 4.4,
        image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&q=80&w=800"],
        sizes: ["One Size"], reviews: [], category: "Fitness", subcategory: "Wearables",
        description: "Slim fitness band that tracks steps, heart rate, and sleep automatically.", stock: 200, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p49", name: "Fabric Resistance Bands (Set of 3)", brand: "BootyBuilder", price: 1200, discount: 0, rating: 4.6,
        image: "https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?auto=format&fit=crop&q=80&w=800", images: ["https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?auto=format&fit=crop&q=80&w=800"],
        sizes: ["Light", "Medium", "Heavy"], reviews: [], category: "Fitness", subcategory: "Wearables",
        description: "Comfortable, non-slip fabric bands that won't roll or snap during workouts.", stock: 110, isTrending: true, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    // --- Laptops Variety (Dell, HP, Lenovo, ASUS, Microsoft) ---
    {
        id: "p50", name: "Dell XPS 15", brand: "Dell", price: 145000, discount: 5, rating: 4.8,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1593642702821-c823b1eeb36f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800"
        ],
        sizes: ["15.6-inch"], reviews: [], tag: "Premium", category: "Computers & Tech", subcategory: "Laptops",
        description: "The ultimate 15-inch laptop for creators. Features a stunning 4K OLED display and powerful performance.", stock: 25, isTrending: true, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p51", name: "HP Spectre x360", brand: "HP", price: 125000, discount: 10, rating: 4.7,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1563825867375-3affced84e27?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1588702547919-26089e690f05?auto=format&fit=crop&q=80&w=800"
        ],
        sizes: ["14-inch"], reviews: [], category: "Computers & Tech", subcategory: "Laptops",
        description: "A premium 2-in-1 convertible laptop combining elegant design with versatile functionality and pen support.", stock: 40, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p52", name: "ASUS ROG Zephyrus G14", brand: "ASUS", price: 165000, discount: 0, rating: 4.9,
        image: "/products/asus_rog_zephyrus_g14.jpg",
        images: ["/products/asus_rog_zephyrus_g14.jpg",
            "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=800"
        ],
        sizes: ["14-inch"], reviews: [], tag: "Gaming", category: "Computers & Tech", subcategory: "Laptops",
        description: "The most powerful 14-inch gaming laptop in the world. Features the latest Ryzen processors and RTX graphics.", stock: 15, isTrending: true, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p53", name: "Lenovo ThinkPad X1 Carbon", brand: "Lenovo", price: 155000, discount: 0, rating: 4.8,
        image: "/products/lenovo_thinkpad_x1_carbon.jpg",
        images: ["/products/lenovo_thinkpad_x1_carbon.jpg",
            "https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1533555299443-46788813f8c8?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1522204538344-922f76ecc041?auto=format&fit=crop&q=80&w=800"
        ],
        sizes: ["14-inch"], reviews: [], tag: "Business", category: "Computers & Tech", subcategory: "Laptops",
        description: "The legendary business laptop. Ultra-thin, ultra-light, and ultra-durable with an unmatched keyboard.", stock: 30, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    },
    {
        id: "p54", name: "Microsoft Surface Laptop 5", brand: "Microsoft", price: 115000, discount: 15, rating: 4.6,
        image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&q=80&w=800",
        images: [
            "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1620242953257-2c1a8518e3e4?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1520607162513-aa01b1de0b17?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1506306566087-db61a7a2a0ff?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
        ],
        sizes: ["13.5-inch"], reviews: [], tag: "Bestseller", category: "Computers & Tech", subcategory: "Laptops",
        description: "Sleek and incredibly light. Featuring a vibrant touchscreen display and the perfect balance of style and speed.", stock: 50, isTrending: false, isLowStock: false,
        salesHistory: [], priceHistory: [], aiInsights: ""
    }
];
