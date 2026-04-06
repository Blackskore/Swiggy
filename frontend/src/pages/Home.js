import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/restaurants/")
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
      <h2 className="section-title">Restaurants with online food delivery in Bangalore</h2>
      
      {loading ? (
        <div className="loader-container">
          <h2>Looking for great food...</h2>
        </div>
      ) : (
        <div className="restaurants-grid">
          {restaurants.map(r => (
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
      
      {!loading && restaurants.length === 0 && (
        <div className="empty-state">
          <h2>No Restaurants yet!</h2>
        </div>
      )}
    </main>
  );
}

export default Home;
