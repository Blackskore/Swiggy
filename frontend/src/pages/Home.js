import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentLocation } = useContext(AuthContext);

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.cuisines && r.cuisines.toLowerCase().includes(searchQuery.toLowerCase()))
  ).map(r => ({
     ...r,
     description: `Central ${currentLocation.split(",")[0]}`  // Adapt to the user's chosen location!
  }));

  useEffect(() => {
    axios.get("/restaurants/")
      .then(res => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching restaurants:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="main-container">
      
      {/* Modern, Central, Immersive Search Bar */}
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "50px", marginTop: "20px"}}>
        <div style={{
           position: "relative",
           width: "100%",
           maxWidth: "700px",
           transform: "translateY(0)",
           transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }} 
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
        className="search-bar-wrapper">
           <div style={{
              position: "absolute",
              inset: "-2px",
              background: "linear-gradient(90deg, #fc8019, #ffb347, #fc8019)",
              borderRadius: "24px",
              filter: "blur(10px)",
              opacity: "0.3",
              zIndex: -1,
              transition: "opacity 0.3s ease"
           }} className="search-glow"></div>
           <input 
             type="text" 
             placeholder="Search for restaurants, cuisines, or dishes..." 
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             style={{
                width: "100%", 
                padding: "20px 30px", 
                paddingRight: "70px",
                borderRadius: "20px", 
                border: "1px solid rgba(255,255,255,0.8)", 
                outline: "none", 
                fontSize: "18px", 
                fontWeight: "500",
                color: "#282c3f",
                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                fontFamily: "'Inter', sans-serif"
             }}
             onFocus={(e) => {
                e.target.style.boxShadow = "0 15px 50px rgba(252, 128, 25, 0.2)";
                e.target.style.borderColor = "rgba(252, 128, 25, 0.6)";
                e.target.style.background = "#ffffff";
             }}
             onBlur={(e) => {
                e.target.style.boxShadow = "0 10px 40px rgba(0,0,0,0.08)";
                e.target.style.borderColor = "rgba(255,255,255,0.8)";
                e.target.style.background = "rgba(255, 255, 255, 0.9)";
             }}
           />
           <div style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #fc8019, #f76b1c)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(252, 128, 25, 0.4)",
              cursor: "pointer",
              transition: "transform 0.2s ease"
           }}
           onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'; }}
           onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
           >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.9999 21L16.6499 16.65" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
           </div>
        </div>
      </div>

      <h2 className="section-title" style={{marginBottom: "30px", fontSize: "28px", letterSpacing: "-0.5px"}}>Restaurants with online food delivery near you</h2>
      
      {loading ? (
        <div className="loader-container">
          <h2>Looking for great food...</h2>
        </div>
      ) : (
        <div className="restaurants-grid">
          {filteredRestaurants.map(r => (
            <Link to={`/restaurant/${r.id}`} key={r.id} style={{textDecoration: 'none'}}>
              <div className="restaurant-card">
                <div className="card-image-wrapper">
                  <img 
                    src={r.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"} 
                    alt={r.name} 
                    className="card-image"
                  />
                  <div className="card-overlay"></div>
                  <div className="card-offer">
                    {r.price_for_two ? `ITEMS AT ₹149` : "FLAT DEAL"}
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="restaurant-name">{r.name}</div>
                  <div className="rating-time-row">
                    <div className="rating-circle">★</div>
                    <span>{r.rating} • {r.delivery_time || "35-40 mins"}</span>
                  </div>
                  <div className="cuisines">{r.cuisines || "North Indian, Fast Food"}</div>
                  <div className="location">{r.description || "City Center"}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && filteredRestaurants.length === 0 && (
        <div className="empty-state">
          <h2>No Restaurants yet!</h2>
        </div>
      )}
    </main>
  );
}

export default Home;
