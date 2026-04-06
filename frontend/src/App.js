import React, { useState, useContext } from "react";
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

function App() {
  const [cart, setCart] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { user, logout, currentLocation, setCurrentLocation, setCoords } = useContext(AuthContext);

  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const address = data.address;
            const simpleLocation = address ? `${address.suburb || address.neighbourhood || address.city_district || ""}, ${address.city || address.state || ""}`.replace(/^, /, "") : data.display_name;
            setCurrentLocation(simpleLocation || "Current Location");
            setCoords([lat, lon]);
            setShowLocationModal(false);
          } catch(e) {
            setCurrentLocation(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
            setCoords([lat, lon]);
            setShowLocationModal(false);
          }
        },
        (error) => {
          alert("Error fetching location. Please ensure location permissions are enabled on your browser.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleManualLocationSearch = async (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
       const query = e.target.value.trim();
       try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
          const data = await res.json();
          if (data && data.length > 0) {
             setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
             setCurrentLocation(data[0].display_name.split(",").slice(0, 2).join(","));
          } else {
             setCurrentLocation(query);
             setCoords([12.9716 + (Math.random() - 0.5), 77.5946 + (Math.random() - 0.5)]);
          }
       } catch (err) {
         setCurrentLocation(query);
       }
       setShowLocationModal(false);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      if (prevCart.length > 0 && prevCart[0].restaurant_id !== item.restaurant_id) {
        if (window.confirm("Your cart contains items from another restaurant. Do you want to clear your cart and start a new order?")) {
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
        {showLocationModal && (
          <div style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999}} onClick={() => setShowLocationModal(false)}>
            <div style={{position: "absolute", top: 0, left: 0, bottom: 0, width: "400px", background: "white", padding: "30px", display: "flex", flexDirection: "column"}} onClick={e => e.stopPropagation()}>
               <div style={{marginBottom: "30px"}}>
                 <span onClick={() => setShowLocationModal(false)} style={{cursor: "pointer", fontSize: "20px"}}>✕</span>
               </div>
               
               <input 
                 type="text" 
                 placeholder="Search for area, street name..." 
                 onKeyDown={handleManualLocationSearch}
                 style={{width: "100%", padding: "18px 20px", border: "1px solid #d4d5d9", outline: "none", fontSize: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", boxSizing: "border-box", borderRadius: "12px"}}
               />

               <div className="location-btn" style={{marginTop: "30px", padding: "20px", border: "1px solid #e9e9eb", display: "flex", alignItems: "center", gap: "20px", cursor: "pointer", transition: "all 0.2s"}} onClick={fetchLocation}>
                 <span style={{fontSize: "24px"}}>🧭</span>
                 <div>
                   <h4 style={{margin: 0, color: "#fc8019", fontSize: "16px"}}>Get current location</h4>
                   <p style={{margin: "5px 0 0 0", color: "#7e808c", fontSize: "13px"}}>Using GPS</p>
                 </div>
               </div>
            </div>
          </div>
        )}
        <header className="header">
          <div style={{display: "flex", alignItems: "center", gap: "40px"}}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <div className="header-left">
                <div className="logo-wrapper">
                  <div className="logo-icon">S</div>
                  <strong className="swiggy-text">Swiggy</strong>
                </div>
              </div>
            </Link>
            
            <div className="location-selector" onClick={() => setShowLocationModal(true)} style={{display: "flex", alignItems: "center", cursor: "pointer", gap: "10px", fontSize: "14px"}}>
               <span style={{fontWeight: "bold", color: "#3d4152", borderBottom: "2px solid #3d4152", paddingBottom: "2px"}}>Other</span>
               <span style={{color: "#686b78", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", maxWidth: "250px"}}>{currentLocation}</span>
               <span style={{color: "#fc8019", fontWeight: "bold", fontSize: "12px"}}>▼</span>
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

            <Link to="/cart" className="nav-item cart-btn" style={{ textDecoration: "none" }}>
              <span>🛒 Cart</span>
              <span className="cart-badge">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
            </Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
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
