import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function Restaurant({ cart, addToCart, removeFromCart }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/restaurants/${id}`)
      .then(res => {
        setRestaurant(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching restaurant:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2 style={{textAlign:'center', marginTop: 50}}>Menu Loading...</h2>;
  if (!restaurant) return <h2 style={{textAlign:'center', marginTop: 50}}>Restaurant Not Found</h2>;

  const getItemQuantity = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="restaurant-page-container">
      <div className="restaurant-header">
        <div>
          <h1 className="restaurant-title">{restaurant.name}</h1>
          <p className="restaurant-cuisines">{restaurant.cuisines}</p>
          <p className="restaurant-location">{restaurant.description} | {restaurant.delivery_time}</p>
          <p className="restaurant-price">⭐ {restaurant.rating} | {restaurant.price_for_two}</p>
        </div>
      </div>
      <hr className="divider" />
      <div style={{display: "flex", gap: "30px", alignItems: "flex-start"}}>
        <div className="menu-section" style={{flex: 2}}>
          <h3 className="menu-title">Recommended ({restaurant.menu_items?.length || 0})</h3>
          
          {restaurant.menu_items?.map(item => (
            <div key={item.id} className="menu-item-row">
              <div className="menu-item-info">
                <div style={{display:'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
                  <span className={item.is_veg ? "veg-icon" : "non-veg-icon"}></span>
                </div>
                <h4 className="menu-item-name">{item.name}</h4>
                <p className="menu-item-price">₹{item.price}</p>
                <p className="menu-item-desc">{item.description}</p>
              </div>
              
              <div className="menu-item-image-container">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="menu-item-image" />
                ) : (
                  <div className="menu-item-image-placeholder"></div>
                )}
                
                {getItemQuantity(item.id) > 0 ? (
                  <div className="quantity-controls">
                    <button onClick={() => removeFromCart(item.id)}>-</button>
                    <span>{getItemQuantity(item.id)}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                ) : (
                  <button className="add-button" onClick={() => addToCart(item)}>ADD</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="mini-cart-section" style={{flex: 1, padding: "20px", border: "1px solid #d4d5d9", borderRadius: "8px", position: "sticky", top: "100px", minWidth: "300px"}}>
             <h3 style={{fontSize: "24px", color: "#282c3f", marginBottom: "5px"}}>Cart</h3>
             <p style={{color: "#7e808c", marginBottom: "20px", fontSize: "14px"}}>{cart.reduce((a,b)=>a+b.quantity,0)} ITEMS</p>
             <div style={{maxHeight: "400px", overflowY: "auto"}}>
                 {cart.map(item => (
                   <div key={item.id} style={{display:'flex', justifyContent:'space-between', alignItems: "center", margin: '15px 0', fontSize: "14px"}}>
                     <span style={{flex: 1}}>{item.name}</span>
                     <div className="cart-quantity-controls" style={{transform: "scale(0.85)", margin: "0 10px"}}>
                          <button onClick={() => removeFromCart(item.id)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => addToCart(item)}>+</button>
                     </div>
                     <span style={{width: "60px", textAlign: "right"}}>₹{item.price * item.quantity}</span>
                   </div>
                 ))}
             </div>
             <div style={{marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #d4d5d9", display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "18px"}}>
               <span>Subtotal</span>
               <span>₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
             </div>
             <p style={{color: "#7e808c", fontSize: "12px", marginTop: "10px"}}>Extra charges may apply</p>
             <Link to="/cart" style={{display: "block", textAlign: "center", background: "#60b246", color: "white", padding: "14px", textDecoration: "none", fontWeight: "bold", marginTop: "20px", borderRadius: "4px"}}>
               CHECKOUT
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Restaurant;
