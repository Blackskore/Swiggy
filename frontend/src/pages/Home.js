import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// ── Cuisine tag colour map ─────────────────────────────────────────────────────
const getCuisineColor = (cuisines = "") => {
    const c = cuisines.toLowerCase();
    if (c.includes("biryani")) return "#d97706";
    if (c.includes("south") || c.includes("tiffin") || c.includes("idli") || c.includes("dosa")) return "#059669";
    if (c.includes("seafood") || c.includes("fish") || c.includes("coastal") || c.includes("goan")) return "#0369a1";
    if (c.includes("chinese") || c.includes("asian")) return "#7c3aed";
    if (c.includes("dessert") || c.includes("ice cream") || c.includes("sweets") || c.includes("mithai")) return "#db2777";
    if (c.includes("cafe") || c.includes("bakery")) return "#6b7280";
    if (c.includes("kebab") || c.includes("mughlai")) return "#92400e";
    if (c.includes("thali") || c.includes("gujarati") || c.includes("rajasth")) return "#0891b2";
    return "#dc2626";
};

// ── No-city placeholder ────────────────────────────────────────────────────────
function NoCityPrompt({ openLocationModal }) {
    return (
        <div style={{
            minHeight: "60vh", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 20px",
        }}>
            <div style={{ fontSize: 80, marginBottom: 24 }}>📍</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#282c3f", marginBottom: 12 }}>
                Where are you ordering from?
            </h2>
            <p style={{ fontSize: 16, color: "#7b7f83", marginBottom: 32, maxWidth: 420, lineHeight: 1.6 }}>
                Set your delivery location to see restaurants available in your city.
            </p>
            <button
                onClick={openLocationModal}
                style={{
                    padding: "16px 40px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg, #fc8019, #f76b1c)",
                    color: "white", fontWeight: 900, fontSize: 17, cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(252,128,25,0.4)",
                    fontFamily: "'Outfit', sans-serif",
                    transition: "transform 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
                🏙️ Select Your City
            </button>
        </div>
    );
}

// ── Home Page ──────────────────────────────────────────────────────────────────
export default function Home({ openLocationModal }) {
    const { selectedCity, currentLocation, locationLoading } = useContext(AuthContext);

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchForCity = useCallback((city) => {
        if (!city) return;
        setLoading(true);
        axios.get(`/restaurants/?city=${encodeURIComponent(city)}`)
            .then(res => { setRestaurants(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // Re-fetch whenever selected city changes
    useEffect(() => {
        if (selectedCity) fetchForCity(selectedCity);
        else setRestaurants([]);
    }, [selectedCity, fetchForCity]);

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.cuisines && r.cuisines.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.area && r.area.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // ── No city selected yet ──────────────────────────────────────────────────
    if (!locationLoading && !selectedCity) {
        return (
            <main className="main-container">
                <NoCityPrompt openLocationModal={openLocationModal} />
            </main>
        );
    }

    return (
        <main className="main-container">

            {/* ── Search Bar ──────────────────────────────────────────────────── */}
            <div style={{ marginBottom: 36 }}>
                <div style={{
                    position: "relative", maxWidth: 680, margin: "0 auto",
                    transition: "transform 0.25s ease",
                }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                    <div style={{
                        position: "absolute", inset: "-2px", borderRadius: 22,
                        background: "linear-gradient(90deg, #fc8019, #ffb347, #fc8019)",
                        filter: "blur(10px)", opacity: 0.2, zIndex: -1,
                    }} />
                    <input
                        type="text"
                        placeholder={selectedCity
                            ? `Search restaurants, cuisines in ${selectedCity}...`
                            : "Search restaurants or cuisines..."}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%", padding: "18px 62px 18px 24px",
                            borderRadius: 20, border: "1.5px solid rgba(255,255,255,0.8)",
                            outline: "none", fontSize: 16, fontWeight: 500, color: "#282c3f",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                            background: "rgba(255,255,255,0.95)", fontFamily: "'Outfit', sans-serif",
                            transition: "all 0.3s ease", boxSizing: "border-box",
                        }}
                        onFocus={e => { e.target.style.boxShadow = "0 12px 40px rgba(252,128,25,0.18)"; e.target.style.borderColor = "rgba(252,128,25,0.55)"; }}
                        onBlur={e => { e.target.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.target.style.borderColor = "rgba(255,255,255,0.8)"; }}
                    />
                    <div style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        width: 42, height: 42, borderRadius: 12,
                        background: "linear-gradient(135deg, #fc8019, #f76b1c)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(252,128,25,0.4)",
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ── Section Header ─────────────────────────────────────────────── */}
            {(selectedCity || locationLoading) && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
                    <h2 className="section-title" style={{ margin: 0, fontSize: 22 }}>
                        {locationLoading
                            ? "Detecting your location..."
                            : `Restaurants in ${selectedCity}`}
                    </h2>
                    {!loading && filteredRestaurants.length > 0 && (
                        <span style={{
                            background: "#fc8019", color: "white", fontWeight: 800,
                            fontSize: 13, padding: "5px 14px", borderRadius: 20,
                        }}>{filteredRestaurants.length} places</span>
                    )}
                </div>
            )}

            {/* ── Loading ─────────────────────────────────────────────────────── */}
            {(loading || locationLoading) && (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                    <div style={{
                        width: 48, height: 48, border: "4px solid #f0f0f0",
                        borderTopColor: "#fc8019", borderRadius: "50%",
                        animation: "spin 0.8s linear infinite", display: "inline-block",
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ marginTop: 16, color: "#7b7f83", fontWeight: 700, fontSize: 15 }}>
                        {locationLoading ? "📍 Detecting your city..." : `🍽️ Loading restaurants in ${selectedCity}...`}
                    </p>
                </div>
            )}

            {/* ── No results ──────────────────────────────────────────────────── */}
            {!loading && !locationLoading && selectedCity && filteredRestaurants.length === 0 && (
                <div style={{
                    textAlign: "center", padding: "80px 20px", background: "white",
                    borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    border: "2px dashed #e9e9eb",
                }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: "#282c3f", marginBottom: 8 }}>
                        {searchQuery ? "No results found" : `No restaurants in ${selectedCity} yet`}
                    </h3>
                    <p style={{ color: "#7b7f83", fontSize: 14, marginBottom: 20 }}>
                        {searchQuery
                            ? `Try a different search term.`
                            : `We're expanding soon! Try another city.`}
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} style={{
                                padding: "10px 24px", borderRadius: 10, border: "none",
                                background: "#fc8019", color: "white", fontWeight: 800,
                                cursor: "pointer", fontSize: 14,
                            }}>Clear Search</button>
                        )}
                        <button onClick={openLocationModal} style={{
                            padding: "10px 24px", borderRadius: 10,
                            border: "2px solid #fc8019", background: "white",
                            color: "#fc8019", fontWeight: 800, cursor: "pointer", fontSize: 14,
                        }}>Change City</button>
                    </div>
                </div>
            )}

            {/* ── Restaurant Grid ─────────────────────────────────────────────── */}
            {!loading && !locationLoading && filteredRestaurants.length > 0 && (
                <div className="restaurants-grid">
                    {filteredRestaurants.map(r => {
                        const cuisineColor = getCuisineColor(r.cuisines);
                        return (
                            <Link key={r.id} to={`/restaurant/${r.id}`} style={{ textDecoration: "none" }}>
                                <div className="restaurant-card">
                                    <div className="card-image-wrapper">
                                        <img
                                            src={r.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"}
                                            alt={r.name}
                                            className="card-image"
                                        />
                                        <div className="card-overlay" />
                                        <div className="card-offer">ITEMS AT ₹149</div>
                                    </div>
                                    <div className="card-content">
                                        <div className="restaurant-name">{r.name}</div>
                                        <div className="rating-time-row">
                                            <div className="rating-circle">★</div>
                                            <span>{r.rating} • {r.delivery_time || "35-40 mins"}</span>
                                        </div>
                                        {/* Cuisine tags */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                                            {(r.cuisines || "").split(",").slice(0, 3).map(tag => (
                                                <span key={tag} style={{
                                                    fontSize: 11, padding: "2px 7px", borderRadius: 6,
                                                    background: `${cuisineColor}15`, color: cuisineColor,
                                                    fontWeight: 700,
                                                }}>{tag.trim()}</span>
                                            ))}
                                        </div>
                                        <div className="location" style={{ fontSize: 13 }}>
                                            📍 {r.area || r.description || selectedCity}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#7b7f83", marginTop: 2 }}>
                                            {r.price_for_two}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
