# 🍔 Swiggy Clone

A fully-functional, highly interactive, and premium food delivery web application inspired by Swiggy. This project features a robust **FastAPI backend** and a visually stunning **React frontend**.

---

## ✨ Key Features

### 🔐 Production-Grade Authentication
- **Secure Backend**: Utilizes `PyJWT`, `passlib`, and `bcrypt` for industry-standard password hashing and JWT issuance.
- **Frontend Context Engine**: A robust React Context (`AuthContext.js`) manages global sessions via `localStorage` and injects Bearer tokens seamlessly using Axios Interceptors explicitly on every request.
- **Smart Route Protection**: Checkout, Cart, and Live Tracking features dynamically block unauthorized users and gracefully redirect them to the sleek Sign-In portal.

### 🛒 Intelligent Cart & Checkout
- **Advanced Cart Logic**: Built-in safeguards inherently prevent cross-restaurant ordering (mimicking real Swiggy rules) while tracking quantities seamlessly.
- **Interactive Secure Payment UI**: A stunning payment simulation vault actively formats 16-digit card entries, checks Expiry (`MM/YY`), validates CVV lengths, and animates a premium loading authorization spinner.

### 🛵 Real-Time Live Map Tracking
- **Automated FastAPI Background Workers**: Upon ordering, the backend cleanly launches a threaded background task that updates your order database status (`PENDING -> PREPARING -> DELIVERED`) physically over time to simulate real-world cooking and delivery workflows.
- **Animated GPS Engine**: The frontend utilizes `react-leaflet` connected natively to OpenStreetMap to establish an awe-inspiring Live Tracking portal. The React layer intelligently interpolates the time-span triggers to actually animate a delivery bike driving across the map to your destination!

### 🎨 Premium UI/UX Design System
- Built heavily around rich aesthetics, gradients, Swiggy's core UI palette (`#fc8019`), hover scaling micro-animations, transparent card overlays, and conditional rendering to ensure a jaw-dropping look and feel.

---

## 🛠️ Technology Stack

- **Backend**: Python, FastAPI, SQLAlchemy (SQLite), Pydantic
- **Frontend**: JavaScript, React.js, React-Router-Dom, Axios
- **Mapping**: Leaflet, React-Leaflet
- **Security**: JWT (JSON Web Tokens), Bcrypt

---

## 🚀 How to Run Locally

### 1. Start the Backend
Open a terminal and install the required Python packages:
```bash
cd backend
pip install fastapi "uvicorn[standard]" sqlalchemy pydantic email-validator pyjwt passlib bcrypt python-multipart requests
```
Boot the server:
```bash
uvicorn main:app --reload
```

### 2. Seed the Database (Optional but recommended)
We wrote automated scripts to instantly populate your SQLite database with premium dummy data and beautiful Unsplash images.
```bash
# In the backend directory:
python seed_menu.py
```

### 3. Start the Frontend
Open a second terminal window:
```bash
cd frontend
npm install
npm start
```
*Your application will automatically launch at `http://localhost:3000`.*

---

## 🏗️ Project Structure

```
├── backend/
│   ├── main.py            # FastAPI entry point & CORS configuration
│   ├── database.py        # SQLite SQLAlchemy engine 
│   ├── models.py          # Database schema models
│   ├── schemas.py         # Pydantic data validation classes
│   ├── auth_utils.py      # Core logic for JWT Tokens and Bcrypt Hashing
│   ├── seed_menu.py       # Data population script
│   └── routes/
│       ├── auth.py        # Signup / Login / Me endpoints
│       ├── order.py       # Order creation & background tracking tasks
│       └── restaurant.py  # Restaurant & Menu fetching endpoints
│
└── frontend/
    ├── src/
    │   ├── App.js         # React Router topology and Cart State
    │   ├── index.js       # AuthProvider wrapper
    │   ├── App.css        # Main stylesheet
    │   ├── Checkout.css   # Interactive Maps and Payment styles
    │   ├── context/
    │   │   └── AuthContext.js # Global JWT authorization engine
    │   └── pages/
    │       ├── Home.js       # Main Restaurant Grid
    │       ├── Restaurant.js # Specific Restaurant Menus
    │       ├── Auth.js       # User Login & Signup forms
    │       ├── Cart.js       # Bill Breakdown & Card Payment simulation
    │       └── Orders.js     # Live Leaflet Map Tracking
    └── package.json
```
