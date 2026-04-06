import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Cart({ cart, addToCart, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Payment Form States
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "SWIGGY50") {
      setDiscount(50);
      alert("Awesome! Promo code SWIGGY50 applied. ₹50 off.");
    } else {
      setDiscount(0);
      alert("Invalid promo code. Hint: Try SWIGGY50");
    }
  };

  const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = itemTotal > 0 ? 40 : 0;
  const taxesAndCharges = itemTotal > 0 ? Math.round(itemTotal * 0.05) : 0;
  const grandTotal = Math.max(0, itemTotal + deliveryFee + taxesAndCharges - discount);

  // Validate form strictness
  const isPaymentValid = paymentMethod === "card" 
    ? (cardNumber.length === 19 && expiry.length === 5 && cvv.length >= 3 && name.length >= 3)
    : paymentMethod === "upi"
    ? (upiId.length > 4 && upiId.includes("@"))
    : true; // Phonepe always valid mock

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
        await axios.post("/orders/", payload);
        
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
              <h2>{paymentMethod === 'phonepe' ? 'Redirecting to PhonePe...' : paymentMethod === 'upi' ? 'Awaiting UPI Approval...' : 'Authorizing Card Payment...'}</h2>
              <p>Connecting securely. Do not refresh or press back.</p>
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
               <h3 style={{marginBottom: "20px"}}>Payment Method</h3>
               <div style={{display: "flex", gap: "10px", marginBottom: "25px"}}>
                 <button onClick={() => setPaymentMethod('card')} style={{flex: 1, padding: '10px', background: paymentMethod === 'card'? '#fc8019' : '#fff', color: paymentMethod === 'card' ? 'white' : '#282c3f', border: '1px solid #d4d5d9', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Card</button>
                 <button onClick={() => setPaymentMethod('upi')} style={{flex: 1, padding: '10px', background: paymentMethod === 'upi'? '#fc8019' : '#fff', color: paymentMethod === 'upi' ? 'white' : '#282c3f', border: '1px solid #d4d5d9', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>UPI</button>
                 <button onClick={() => setPaymentMethod('phonepe')} style={{flex: 1, padding: '10px', background: paymentMethod === 'phonepe'? '#5f259f' : '#fff', color: paymentMethod === 'phonepe' ? 'white' : '#282c3f', border: '1px solid #d4d5d9', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>PhonePe</button>
               </div>

               {paymentMethod === "card" && (
                 <div>
                   <h3 style={{display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px"}}>💳 Secure Credit Card</h3>
                   <div className="payment-form">
                     <input 
                       className={`pay-input ${cardNumber.length > 0 && cardNumber.length < 19 ? 'error' : ''}`}
                       placeholder="Card Number (mock)" 
                       maxLength="19" 
                       value={cardNumber} 
                       onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} 
                     />
                     <div style={{display: "flex", gap: "15px"}}>
                        <input className="pay-input" placeholder="MM/YY" maxLength="5" value={expiry} onChange={e => { let val = e.target.value.replace(/\D/g, ""); if(val.length >= 2) val = val.substring(0,2) + "/" + val.substring(2,4); setExpiry(val); }} />
                        <input className="pay-input" placeholder="CVV" type="password" maxLength="4" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))} />
                     </div>
                     <input className="pay-input" placeholder="Name on Card" maxLength="30" value={name} onChange={e => setName(e.target.value)} />
                   </div>
                 </div>
               )}

               {paymentMethod === "upi" && (
                 <div>
                   <h3 style={{display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px"}}>📱 UPI Payment</h3>
                   <input className="pay-input" placeholder="Enter UPI ID (e.g. user@ybl)" value={upiId} onChange={e => setUpiId(e.target.value)} />
                 </div>
               )}

               {paymentMethod === "phonepe" && (
                 <div style={{textAlign: "center", padding: "10px"}}>
                   <h3 style={{color: "#5f259f", marginBottom: "10px"}}>PhonePe Testing</h3>
                   <p style={{color: "#7e808c", fontSize: "14px"}}>Mock PhonePe gateway will be initiated upon payment.</p>
                 </div>
               )}
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

              <div style={{display: "flex", gap: "10px", margin: "20px 0", borderTop: "1px dashed #d4d5d9", borderBottom: "1px dashed #d4d5d9", padding: "15px 0"}}>
                 <input className="pay-input" style={{margin: 0, textTransform: "uppercase"}} placeholder="Enter Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                 <button onClick={applyPromo} style={{background: "#fc8019", color: "white", padding: "0 20px", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer"}}>APPLY</button>
              </div>

              <div className="bill-details">
                <div className="bill-row"><span>Item Total</span><span>₹{itemTotal}</span></div>
                <div className="bill-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
                {discount > 0 && <div className="bill-row" style={{color: "#4BB543", fontWeight: "bold"}}><span>Promo Discount</span><span>-₹{discount}</span></div>}
                <div className="bill-row"><span>Taxes and Charges</span><span>₹{taxesAndCharges}</span></div>
                <hr className="divider" style={{margin: "15px 0"}}/>
                <div className="bill-row grand-total"><span>TO PAY</span><span>₹{grandTotal}</span></div>
              </div>
              
              <button 
                className="pay-button" 
                onClick={handleCheckout}
                disabled={!isPaymentValid}
                style={{ opacity: isPaymentValid ? 1 : 0.6, background: paymentMethod === 'phonepe' ? '#5f259f' : '#fc8019' }}
              >
                {paymentMethod === 'phonepe' ? 'PAY WITH PHONEPE' : `PAY ₹${grandTotal}`}
              </button>
              
              {!isPaymentValid && <p style={{color: "#e43b4f", fontSize: "12px", textAlign: "center", marginTop: "10px", fontWeight: "bold"}}>Please enter valid mock payment details.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
