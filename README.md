# Swiggy Clone — Premium Multi-City Food Delivery App

A high-performance Swiggy clone built with **React (Frontend)** and **FastAPI (Backend)**, featuring a premium glassmorphism/neomorphism design and a robust local-first database setup.

## 🚀 Key Features

### 🌆 Multi-City Support (13 Major Indian Cities)
- **Bengaluru, Mumbai, Delhi, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Kochi, Chandigarh, Lucknow, Goa**.
- **Smart Location Modal**: A sleek, slide-in side panel with type-to-search city suggestions and GPS auto-detection.
- **Thematic Branding**: The app's accent colors and emojis dynamically change based on the selected city (e.g., 🌊 Mumbai Blue, 🌸 Bengaluru Purple, 🏯 Delhi Red).

### 🍕 Dynamic Restaurant & Menu System
- **84+ Curated Restaurants**: Hand-picked popular outlets across all supported cities.
- **Randomized Menu Generation**: Every restaurant features 3-5 thematic items (Biryanis, Burgers, South Indian, etc.) with high-quality images.
- **Smart Search**: Filter by restaurant name, cuisine type, or specific area in real-time.

### 📦 Live Order Tracking
- **Automated Lifecycle**: Orders automatically progress from `PLACED` → `PREPARING` → `DELIVERED`.
- **Animated Map Tracking**: A live Leaflet-powered map showing a delivery partner moving from the restaurant to your destination in real-time.
- **Crash-Resistant Design**: Robust coordinate handling ensure the map works perfectly even if GPS permissions are denied.

### 💳 Interactive Cart & Checkout
- **Mock Payment Gateway**: Support for Card, UPI, and PhonePe simulations with realistic processing delays and success animations.
- **Promo Codes**: Apply `SWIGGY50` to get instant discounts on your order.
- **Billed Accuracy**: The backend captures the exact final amount (including taxes, delivery fees, and discounts) for your order history.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Context API, Axios, Leaflet (Mapping).
- **Backend**: FastAPI (Python), SQLAlchemy, Uvicorn, Jose (JWT).
- **Database**: SQLite (Local fallback `swiggy_clone.db`).

---

## 🚦 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
python seed_cities.py     # Seeds the 84 restaurants and 300+ items
python -m uvicorn main:app --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 🔑 Note on Google Maps
The app is currently configured for **OpenStreetMap (Leaflet)** for order tracking (free, no key required). If you wish to re-enable the Google Maps nearby discovery feature, add your `REACT_APP_GOOGLE_MAPS_KEY` to `frontend/.env`.

---

## ✅ Recent Stabilization
- Fixed `TypeError` in `animate` loop for tracking maps.
- Resolved database column mismatch (added `city` and `area`).
- Improved background task reliability for order status progression.
- Optimized image loading with premium Unsplash thematic pools.
