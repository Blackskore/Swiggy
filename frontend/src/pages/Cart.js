import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Cart({ cart, addToCart, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = itemTotal > 0 ? 40 : 0;
  const taxesAndCharges = itemTotal > 0 ? Math.round(itemTotal * 0.05) : 0;
  const grandTotal = itemTotal + deliveryFee + taxesAndCharges;

  // Validate form strictness
  const isCardValid = cardNumber.length === 19 && expiry.length === 5 && cvv.length >= 3 && name.length >= 3;

  const handleCheckout = async () => {
    setProcessing(true);
    
    // Simulate real gateway processing
    setTimeout(async () => {
      setPaymentSuccess(true);
      
      try {
        const payload = {
          restaurant_id: cart[0].restaurant_id,
          items: cart.map(i => ({ menu_item_id: i.id, quantity: i.quantity }))
        };
        await axios.post("http://127.0.0.1:8000/orders/", payload);
        
        setTimeout(() => {
          clearCart();
          navigate("/orders");
        }, 1500);

      } catch(err) {
        console.error(err);
        alert("Failed to create order on backend.");
        setProcessing(false);
        setPaymentSuccess(false);
      }
    }, 2500);
  };

  if (!user) {
    return (
      <div className="empty-state" style={{marginTop: "50px"}}>
        <h2 style={{color: "#282c3f", fontSize: "28px"}}>Account Required for Checkout</h2>
        <p style={{marginTop: "10px", color: "#7e808c"}}>Please sign in to place your order successfully locally.</p>
        <Link to="/auth" style={{display: "inline-block", marginTop: "30px", padding: "12px 20px", backgroundColor: "#fc8019", color: "white", textDecoration: "none", fontWeight: "bold", borderRadius: "4px"}}>
          LOG IN NOW TO CONTINUE
        </Link>
      </div>
    );
  }

  if (cart.length === 0 && !processing && !paymentSuccess) {
    return (
      <div className="empty-state" style={{marginTop: "50px"}}>
        <h2 style={{color: "#282c3f", fontSize: "28px"}}>Your cart is empty</h2>
        <p style={{marginTop: "10px", color: "#7e808c"}}>You can go to home page to view more restaurants</p>
        <Link to="/" style={{display: "inline-block", marginTop: "30px", padding: "12px 20px", backgroundColor: "#fc8019", color: "white", textDecoration: "none", fontWeight: "bold", borderRadius: "4px"}}>
          SEE RESTAURANTS NEAR YOU
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {processing || paymentSuccess ? (
        <div className="payment-processing">
          {!paymentSuccess ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              <h2>Authorizing Payment...</h2>
              <p>Connecting securely to Visa/Mastercard. Do not refresh.</p>
            </div>
          ) : (
            <div className="success-container">
              <div className="checkmark">✔</div>
              <h2>Payment Successful!</h2>
              <p>Your order was securely billed. Redirecting to tracking...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-left">
            <div className="checkout-step box-shadow">
              <h3>Account</h3>
              <p>Logged in. You are ready to checkout!</p>
            </div>
            
            <div className="checkout-step box-shadow">
              <h3 style={{display: "flex", gap: "10px", alignItems: "center"}}>💳 Secure Credit Card Payment</h3>
              <p style={{color: "#7e808c", fontSize: "14px", marginBottom: "15px"}}>Enter your card details (Interactive test mode)</p>
              
              <div className="payment-form">
                <input 
                  className={`pay-input ${cardNumber.length > 0 && cardNumber.length < 19 ? 'error' : ''}`}
                  placeholder="Card Number (16 digits)" 
                  maxLength="19" 
                  value={cardNumber} 
                  onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} 
                />
                <div style={{display: "flex", gap: "15px"}}>
                   <input 
                     className="pay-input" 
                     placeholder="MM/YY" 
                     maxLength="5" 
                     value={expiry} 
                     onChange={e => {
                       let val = e.target.value.replace(/\D/g, "");
                       if(val.length >= 2) val = val.substring(0,2) + "/" + val.substring(2,4);
                       setExpiry(val);
                     }}
                   />
                   <input 
                     className="pay-input" 
                     placeholder="CVV" 
                     type="password"
                     maxLength="4" 
                     value={cvv} 
                     onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                   />
                </div>
                <input 
                  className="pay-input" 
                  placeholder="Name on Card" 
                  maxLength="30" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="cart-right">
            <div className="bill-card box-shadow">
              <h3 style={{marginBottom: "20px"}}>Order Summary</h3>
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                     <div className="cart-item-name"><span className={item.is_veg ? "veg-icon" : "non-veg-icon"} style={{marginRight: 6}}></span>{item.name}</div>
                     <div className="cart-quantity-controls">
                        <button onClick={() => removeFromCart(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => addToCart(item)}>+</button>
                     </div>
                     <div className="cart-item-price">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              <div className="bill-details">
                <div className="bill-row"><span>Item Total</span><span>₹{itemTotal}</span></div>
                <div className="bill-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
                <div className="bill-row"><span>Taxes and Charges</span><span>₹{taxesAndCharges}</span></div>
                <hr className="divider" style={{margin: "15px 0"}}/>
                <div className="bill-row grand-total"><span>TO PAY</span><span>₹{grandTotal}</span></div>
              </div>
              
              <button 
                className="pay-button" 
                onClick={handleCheckout}
                disabled={!isCardValid}
                style={{ opacity: isCardValid ? 1 : 0.6 }}
              >
                PAY ₹{grandTotal} 
              </button>
              
              {!isCardValid && <p style={{color: "#e43b4f", fontSize: "12px", textAlign: "center", marginTop: "10px", fontWeight: "bold"}}>Complete the mock card details to proceed.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
