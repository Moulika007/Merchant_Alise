# 🛍️ Merchant Aisle

**A full-stack AI-powered e-commerce platform with a real-time Seller Intelligence Dashboard.**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-orange?logo=google)](https://aistudio.google.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)

---

## 📌 Overview

Merchant Aisle is a modern e-commerce platform built for both **buyers** and **sellers**. Buyers get a clean, intuitive shopping experience, while sellers get a powerful AI-driven dashboard with real-time demand analytics, surge detection, and market intelligence.

---

## ✨ Features

### 🛒 Buyer Side
- Browse products by category & search
- Detailed product pages with image gallery, reviews & size selection
- Cart, Buy It Now & order placement
- Responsive design with smooth animations

### 📊 Seller Dashboard
| Feature | Description |
|---|---|
| **Overview** | Revenue, orders, stock KPIs + AI Smart Recommendations |
| **Analytics** | Sales charts, demand trends, price history per product |
| **Surge Analysis** | Real-time global surge map with city-level demand events |
| **Regional Insights** | Hyperlocal demand heatmap + Zone Intelligence Table |
| **Surge Prediction Radar** | AI early warning system for upcoming demand spikes |
| **Market Specialist Chatbot** | Gemini 2.0 Flash AI that answers inventory & surge questions |
| **Surge Notifications** | ⚠️ Pre-surge warning at 50%, 🚀 full alert at 100% of threshold |
| **Inventory Management** | Edit products, restock, track low-stock alerts |

---

## 🧠 AI Features

- **Market Specialist Chatbot** — Powered by Google Gemini 2.0 Flash. Click a city on the surge map → get an AI-powered deep-dive on demand patterns, inventory advice, and pricing strategy.
- **Smart Action Recommendations** — Dynamic AI insights based on product stock levels and sales velocity.
- **Surge Prediction** — Tracks cart additions per product per session; fires pre-surge warning at 50% and full surge alert at 100% of threshold.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **Leaflet.js** — Interactive demand heatmap
- **Socket.io-client** — Real-time events
- **@google/generative-ai** — Gemini AI SDK
- **React Router v6** — Client-side routing

### Backend
- **Node.js** + **Express**
- **MongoDB Atlas** — Product, order & user data
- **Socket.io** — Real-time buyer-to-seller event pipeline
- **Redis** — Surge velocity tracking & caching
- **node-cron** — Periodic surge engine runs

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Redis instance (local or cloud)
- Google Gemini API key → [Get one free](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/Moulika007/Merchant_Alise.git
cd Merchant_Alise
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
REDIS_URL=your_redis_url
PORT=5001
```

Start the backend:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the App
- **Buyer Store:** [http://localhost:5173](http://localhost:5173)
- **Seller Dashboard:** [http://localhost:5173/seller/overview](http://localhost:5173/seller/overview)

---

## 📁 Project Structure

```
eCom_Final/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # StoreContext (global state)
│   │   ├── pages/
│   │   │   ├── buyer/        # ProductDetails, Cart, Checkout
│   │   │   ├── seller/       # Analytics, Surge, Regional Insights
│   │   │   └── LandingPage   # Homepage hero + curated products
│   │   ├── hooks/            # useIpLocation, useSocket
│   │   ├── mockData.ts       # Product seed data
│   │   └── App.tsx
│   └── vite.config.ts
│
└── backend/
    ├── server.js             # Express + Socket.io entry
    ├── routes/               # API routes
    ├── models/               # MongoDB schemas
    ├── services/
    │   └── surgeEngine.js    # Redis-based surge detection cron
    └── config/
        └── db.js
```

---

## 🧪 Testing Surge Notifications

1. Open **Seller Dashboard** in one tab
2. Open any **Product page** in another tab
3. Click **"Add to Cart"** 5 times → ⚠️ Pre-surge warning appears
4. Click 5 more times → 🚀 Full surge alert fires with sound + notification

---

## 📄 License

MIT License — feel free to use this for learning, demos, or as a base for your own project.

---

> Built with ❤️ by [Moulika](https://github.com/Moulika007)
