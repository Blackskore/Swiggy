import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Restaurant({ cart, addToCart, removeFromCart }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/restaurants/${id}`)
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
      <div className="menu-section">
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
    </div>
  );
}

export default Restaurant;
