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
      
      {/* Immersive Search Bar placed boldly on the left side */}
      <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: "40px", marginTop: "10px"}}>
        <div style={{
           position: "relative",
           width: "100%",
           maxWidth: "600px",
           transform: "translateY(0)",
           transition: "transform 0.2s ease"
        }} className="search-bar-wrapper">
           <input 
             type="text" 
             placeholder="Search for restaurants and food..." 
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             style={{
                width: "100%", 
                padding: "20px 24px", 
                paddingRight: "60px",
                borderRadius: "16px", 
                border: "1px solid rgba(0,0,0,0.08)", 
                outline: "none", 
                fontSize: "18px", 
                fontWeight: "500",
                color: "#282c3f",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                background: "white",
                transition: "all 0.3s ease"
             }}
             onFocus={(e) => {
                e.target.style.boxShadow = "0 12px 35px rgba(252, 128, 25, 0.15)";
                e.target.style.borderColor = "rgba(252, 128, 25, 0.5)";
             }}
             onBlur={(e) => {
                e.target.style.boxShadow = "0 10px 30px rgba(0,0,0,0.06)";
                e.target.style.borderColor = "rgba(0,0,0,0.08)";
             }}
           />
           <div style={{
              position: "absolute",
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "24px",
              color: "#fc8019",
              opacity: 0.8
           }}>🔍</div>
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
