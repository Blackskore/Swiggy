import React, { useState, useContext, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import { AuthContext } from "./context/AuthContext";
import "./App.css";
import "./Checkout.css";

// ── All Indian cities the app supports ────────────────────────────────────────
const INDIA_CITIES = [
    { name: "Bengaluru",  emoji: "🌸", state: "Karnataka" },
    { name: "Mumbai",     emoji: "🌊", state: "Maharashtra" },
    { name: "Delhi",      emoji: "🏯", state: "Delhi NCR" },
    { name: "Hyderabad",  emoji: "💎", state: "Telangana" },
    { name: "Chennai",    emoji: "🌴", state: "Tamil Nadu" },
    { name: "Kolkata",    emoji: "🎨", state: "West Bengal" },
    { name: "Pune",       emoji: "⚡", state: "Maharashtra" },
    { name: "Ahmedabad",  emoji: "🦁", state: "Gujarat" },
    { name: "Jaipur",     emoji: "🏰", state: "Rajasthan" },
    { name: "Kochi",      emoji: "🐠", state: "Kerala" },
    { name: "Chandigarh", emoji: "🌻", state: "Punjab/Haryana" },
    { name: "Lucknow",    emoji: "🕌", state: "Uttar Pradesh" },
    { name: "Goa",        emoji: "🏖️", state: "Goa" },
];

// ── Location Modal ─────────────────────────────────────────────────────────────
function LocationModal({ onClose }) {
    const { setCurrentLocation, setSelectedCity } = useContext(AuthContext);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsError, setGpsError] = useState("");
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    // Filter city suggestions as user types
    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (!q) { setSuggestions([]); return; }
        const matched = INDIA_CITIES.filter(
            c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
        );
        setSuggestions(matched);
    }, [query]);

    const selectCity = (city) => {
        setCurrentLocation(`${city.name}, ${city.state}`);
        setSelectedCity(city.name);
        onClose();
    };

    const detectGPS = () => {
        setGpsLoading(true);
        setGpsError("");
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                        { headers: { "Accept-Language": "en" } }
                    );
                    const data = await res.json();
                    const addr = data.address || {};
                    const city = addr.city || addr.town || addr.village || addr.county || "";
                    const state = addr.state || "";
                    const area = addr.suburb || addr.neighbourhood || "";

                    // Match to nearest supported city
                    const matched = INDIA_CITIES.find(c =>
                        (city || "").toLowerCase().includes(c.name.toLowerCase()) ||
                        c.name.toLowerCase().includes((city || "").toLowerCase())
                    );

                    if (matched) {
                        setCurrentLocation(area ? `${area}, ${matched.name}` : `${matched.name}, ${state}`);
                        setSelectedCity(matched.name);
                    } else {
                        // City not in our list yet — set as display only
                        setCurrentLocation(city ? `${city}, ${state}` : `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
                        setSelectedCity(city || "Bengaluru");
                    }
                    setGpsLoading(false);
                    onClose();
                } catch {
                    setGpsError("Could not fetch address. Try typing your city.");
                    setGpsLoading(false);
                }
            },
            (err) => {
                setGpsError("Location permission denied. Please type your city below.");
                setGpsLoading(false);
            },
            { timeout: 8000 }
        );
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
                zIndex: 9999, display: "flex", alignItems: "flex-start",
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    position: "absolute", top: 0, left: 0, bottom: 0, width: 420,
                    background: "white", display: "flex", flexDirection: "column",
                    boxShadow: "4px 0 40px rgba(0,0,0,0.2)",
                    animation: "slideIn 0.25s ease",
                }}
            >
                <style>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>

                {/* Header */}
                <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid #f4f5f7" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#282c3f" }}>
                            📍 Select Delivery Location
                        </h2>
                        <button onClick={onClose} style={{
                            border: "none", background: "#f4f5f7", borderRadius: 8,
                            width: 32, height: 32, cursor: "pointer", fontWeight: 900, fontSize: 16, color: "#686b78",
                        }}>✕</button>
                    </div>

                    {/* Search Input */}
                    <div style={{ position: "relative" }}>
                        <span style={{
                            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                            fontSize: 16, color: "#aaa",
                        }}>🔍</span>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for your city..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            style={{
                                width: "100%", padding: "14px 14px 14px 42px",
                                borderRadius: 12, border: "2px solid #e9e9eb",
                                outline: "none", fontSize: 15, fontFamily: "'Outfit', sans-serif",
                                boxSizing: "border-box", transition: "border-color 0.2s",
                            }}
                            onFocus={e => e.target.style.borderColor = "#fc8019"}
                            onBlur={e => e.target.style.borderColor = "#e9e9eb"}
                        />
                    </div>

                    {/* Suggestions dropdown */}
                    {suggestions.length > 0 && (
                        <div style={{
                            marginTop: 8, border: "1px solid #e9e9eb", borderRadius: 12,
                            overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                        }}>
                            {suggestions.map((city, i) => (
                                <div
                                    key={city.name}
                                    onClick={() => selectCity(city)}
                                    style={{
                                        padding: "14px 16px", cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: 12,
                                        borderBottom: i < suggestions.length - 1 ? "1px solid #f4f5f7" : "none",
                                        background: "white", transition: "background 0.15s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#fff8f0"}
                                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                                >
                                    <span style={{ fontSize: 22 }}>{city.emoji}</span>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: 15, color: "#282c3f" }}>{city.name}</div>
                                        <div style={{ fontSize: 12, color: "#7b7f83" }}>{city.state}</div>
                                    </div>
                                    <span style={{ marginLeft: "auto", color: "#fc8019", fontSize: 16 }}>→</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No match message */}
                    {query.trim() && suggestions.length === 0 && (
                        <p style={{ marginTop: 10, fontSize: 13, color: "#a0a4ab", textAlign: "center" }}>
                            No matching city found. Try another name.
                        </p>
                    )}
                </div>

                {/* GPS Detect */}
                <div style={{ padding: "20px 28px" }}>
                    <div
                        onClick={!gpsLoading ? detectGPS : undefined}
                        style={{
                            display: "flex", alignItems: "center", gap: 16,
                            padding: "18px 20px", border: "2px solid #e9e9eb",
                            borderRadius: 14, cursor: gpsLoading ? "wait" : "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#fc8019"; e.currentTarget.style.background = "#fff8f0"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e9e9eb"; e.currentTarget.style.background = "white"; }}
                    >
                        <div style={{
                            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                            background: "linear-gradient(135deg, #fc8019, #f76b1c)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                            boxShadow: "0 4px 12px rgba(252,128,25,0.3)",
                        }}>
                            {gpsLoading ? "⏳" : "🧭"}
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 15, color: "#fc8019" }}>
                                {gpsLoading ? "Detecting your location..." : "Use my current location"}
                            </div>
                            <div style={{ fontSize: 12, color: "#7b7f83", marginTop: 2 }}>
                                {gpsLoading ? "Please wait" : "Auto-detect via GPS"}
                            </div>
                        </div>
                    </div>
                    {gpsError && (
                        <p style={{ marginTop: 10, fontSize: 12, color: "#e43b4f", fontWeight: 500 }}>
                            ⚠️ {gpsError}
                        </p>
                    )}
                </div>

                {/* Popular Cities */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0 28px 28px" }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: "#7b7f83", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 14 }}>
                        Popular Cities
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {INDIA_CITIES.map(city => (
                            <div
                                key={city.name}
                                onClick={() => selectCity(city)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 14,
                                    padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                                    transition: "background 0.15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#fff8f0"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <span style={{ fontSize: 24, width: 32, textAlign: "center" }}>{city.emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: "#282c3f" }}>{city.name}</div>
                                    <div style={{ fontSize: 11, color: "#7b7f83" }}>{city.state}</div>
                                </div>
                                <span style={{ color: "#d4d5d9", fontSize: 14 }}>›</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── App ────────────────────────────────────────────────────────────────────────
function App() {
    const [cart, setCart] = useState([]);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const { user, currentLocation, selectedCity, locationLoading } = useContext(AuthContext);

    const addToCart = (item) => {
        setCart((prevCart) => {
            if (prevCart.length > 0 && prevCart[0].restaurant_id !== item.restaurant_id) {
                if (window.confirm("Your cart contains items from another restaurant. Start a new order?")) {
                    return [{ ...item, quantity: 1 }];
                }
                return prevCart;
            }
            const existing = prevCart.find((i) => i.id === item.id);
            if (existing) {
                return prevCart.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => {
            const existing = prevCart.find((i) => i.id === itemId);
            if (existing && existing.quantity > 1) {
                return prevCart.map((i) => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
            }
            return prevCart.filter((i) => i.id !== itemId);
        });
    };

    const clearCart = () => setCart([]);

    return (
        <BrowserRouter>
            <div className="app">
                {showLocationModal && <LocationModal onClose={() => setShowLocationModal(false)} />}

                <header className="header">
                    <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <div className="header-left">
                                <div className="logo-wrapper">
                                    <div className="logo-icon">S</div>
                                    <strong className="swiggy-text">Swiggy</strong>
                                </div>
                            </div>
                        </Link>

                        {/* Location Selector */}
                        <div
                            className="location-selector"
                            onClick={() => setShowLocationModal(true)}
                            style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "8px", fontSize: "14px", maxWidth: 300 }}
                        >
                            <span style={{ fontSize: 18 }}>📍</span>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "#7b7f83", letterSpacing: "0.4px", textTransform: "uppercase" }}>
                                    Delivering to
                                </div>
                                <div style={{ fontWeight: 800, color: "#282c3f", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {locationLoading ? (
                                        <span style={{ color: "#aaa", fontWeight: 400 }}>Detecting...</span>
                                    ) : currentLocation || (
                                        <span style={{ color: "#fc8019" }}>Select your city ▼</span>
                                    )}
                                </div>
                            </div>
                            <span style={{ color: "#fc8019", fontWeight: 900, fontSize: 12, flexShrink: 0 }}>▼</span>
                        </div>
                    </div>

                    <nav className="nav-links">
                        {user ? (
                            <Link to="/profile" className="nav-item" style={{ textDecoration: "none" }}>
                                <span style={{ color: "#fc8019", fontWeight: 800 }}>👤 {user.name}</span>
                            </Link>
                        ) : (
                            <Link to="/auth" className="nav-item" style={{ textDecoration: "none" }}>
                                <span>👤 Sign In</span>
                            </Link>
                        )}
                        <Link to="/orders" className="nav-item" style={{ textDecoration: "none" }}>
                            <span>📦 Orders</span>
                        </Link>
                        <Link to="/cart" className="nav-item cart-btn" style={{ textDecoration: "none" }}>
                            <span>🛒 Cart</span>
                            <span className="cart-badge">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                        </Link>
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<Home openLocationModal={() => setShowLocationModal(true)} />} />
                    <Route path="/restaurant/:id" element={<Restaurant cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/cart" element={<Cart cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
