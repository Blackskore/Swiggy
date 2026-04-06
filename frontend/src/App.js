import React, { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import { AuthContext } from "./context/AuthContext";
import "./App.css";
import "./Checkout.css";

function App() {
  const [cart, setCart] = useState([]);
  const { user, logout } = useContext(AuthContext);

  const addToCart = (item) => {
    setCart((prevCart) => {
      if (prevCart.length > 0 && prevCart[0].restaurant_id !== item.restaurant_id) {
        if(window.confirm("Your cart contains items from another restaurant. Do you want to clear your cart and start a new order?")) {
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
        <header className="header">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="header-left">
              <div className="logo-wrapper">
                <div className="logo-icon">S</div>
                <strong className="swiggy-text">SwiggyClone</strong>
              </div>
            </div>
          </Link>

          <nav className="nav-links">
            <Link to="/orders" className="nav-item" style={{ textDecoration: "none" }}>
              <span>📦 Orders</span>
            </Link>
            
            {user ? (
               <div className="nav-item" onClick={logout} style={{cursor: "pointer"}}>
                   <span style={{color: "#fc8019", fontWeight: 800}}>👤 {user.name} (Logout)</span>
               </div>
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
