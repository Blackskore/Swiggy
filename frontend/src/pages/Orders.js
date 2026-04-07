import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AuthContext } from "../context/AuthContext";

// Highly aesthetic CDN Icons for mapping
const restIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/3170/3170733.png', iconSize: [40, 40], iconAnchor: [20, 20] });
const homeIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', iconSize: [35, 35], iconAnchor: [17, 35] });
const bikeIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png', iconSize: [50, 50], iconAnchor: [25, 25] });

const REST_POS = [12.9716, 77.5946];
const HOME_POS = [12.9352, 77.6245];

function LiveMap({ status, homeCoords }) {
    // 🛡️ Comprehensive safety check for coordinates
    const getSafeCoords = (coords) => {
        if (Array.isArray(coords) && coords.length >= 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
            return coords;
        }
        return [12.9716, 77.5946]; // Default to Bangalore center
    };

    const targetPos = getSafeCoords(homeCoords);
    const startPos = [targetPos[0] + 0.012, targetPos[1] - 0.012]; // Fixed offset from target
    
    const [pos, setPos] = useState(startPos);
    
    useEffect(() => {
        let animationFrameId;

        if (status === "PENDING") {
            setPos(startPos);
        } else if (status === "DELIVERED") {
            setPos(targetPos);
        } else if (status === "PREPARING") {
            const startTime = Date.now();
            const duration = 12000; // 12 seconds for smoother travel

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentLat = startPos[0] + (targetPos[0] - startPos[0]) * progress;
                const currentLng = startPos[1] + (targetPos[1] - startPos[1]) * progress;
                
                setPos([currentLat, currentLng]);

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            };
            animationFrameId = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [status, targetPos[0], targetPos[1]]); // Rely on primitive values to avoid ref-trigger loops
    
    return (
        <MapContainer 
            center={[(startPos[0] + targetPos[0]) / 2, (startPos[1] + targetPos[1]) / 2]} 
            zoom={15} 
            scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
          <Marker position={startPos} icon={restIcon}></Marker>
          <Marker position={targetPos} icon={homeIcon}><Popup>Delivery Destination</Popup></Marker>
          <Marker position={pos} icon={bikeIcon}>
             <Popup>Delivery Partner is on the way!</Popup>
          </Marker>
        </MapContainer>
    );
}

function Orders({ isProfileEmbedded }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, coords } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;
    
    // Poll orders every 3 seconds for simulated automated real-time backend updates!
    const fetchOrders = () => {
      axios.get("/orders/")
        .then(res => {
          const sorted = res.data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
          setOrders(sorted);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    };
    
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return (
      <div className="empty-state" style={{marginTop: "50px"}}>
        <h2 style={{color: "#282c3f", fontSize: "28px"}}>Account Secured Required</h2>
        <p style={{marginTop: "10px", color: "#7e808c"}}>Sign in using your account to view past orders and access realtime Live Tracking grids!</p>
        <Link to="/auth" style={{display: "inline-block", marginTop: "30px", padding: "12px 20px", backgroundColor: "#fc8019", color: "white", textDecoration: "none", fontWeight: "bold", borderRadius: "4px"}}>
          SIGN IN TO VIEW ORDERS
        </Link>
      </div>
    );
  }

  if (loading) return <h2 style={{textAlign: "center", marginTop: 50}}>Loading Orders...</h2>;

  return (
    <div className="orders-container" style={isProfileEmbedded ? {padding: 0} : {maxWidth: "800px", margin: "40px auto"}}>
      {!isProfileEmbedded && <h2 style={{fontSize: "28px", marginBottom: "30px"}}>Past Orders & Live Tracking</h2>}
      
      {orders.length === 0 ? (
        <div className="empty-state">
           <h3>No orders found.</h3>
           <Link to="/">Order something delicious!</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, idx) => (
            <div key={order.id} className="order-card box-shadow">
              <div className="order-header">
                <div>
                   <h3 className="order-restaurant">{order.restaurant ? order.restaurant.name : `Swiggy Order #${order.id}`}</h3>
                   <div style={{fontSize: "12px", color: "#686b78", fontWeight: "bold", marginTop: 4}}>{order.restaurant ? order.restaurant.area : "Online Order"}</div>
                   <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <div className="order-total">
                   <span style={{fontSize: "13px", color: "#7e808c", display: "block", textAlign: "right"}}>Transaction Success</span>
                   <span style={{fontSize: "18px", fontWeight: 800, color: "#282c3f"}}>₹{order.total_amount}</span>
                </div>
              </div>

              {/* Added Real Items Summary */}
              <div style={{padding: "15px 0", borderTop: "1px solid #f2f2f2"}}>
                 {order.items && order.items.map(i => (
                    <div key={i.id} style={{fontSize: "13px", color: "#3d4152", marginBottom: 5}}>
                       {i.menu_item ? `${i.menu_item.name} x ${i.quantity}` : `Item x ${i.quantity}`}
                    </div>
                 ))}
              </div>
              
              {/* Order Tracking Progress Bar Visualizer */}
              <div className="tracking-container">
                <div className="tracking-line">
                   <div className="tracking-progress" style={{width: order.status === "PENDING" ? "25%" : order.status === "PREPARING" ? "50%" : "100%"}}></div>
                </div>
                <div className="tracking-steps">
                   <div className={`track-step ${order.status !== "CANCELLED" ? "active" : ""}`}>Placed</div>
                   <div className={`track-step ${order.status === "PREPARING" || order.status === "DELIVERED" ? "active" : ""}`}>Preparing</div>
                   <div className={`track-step ${order.status === "DELIVERED" ? "active" : ""}`}>Delivered</div>
                </div>
              </div>
              <p className="order-status-text" style={{marginTop:"30px"}}>Live Status: <strong style={{color: "#fc8019"}}>{order.status}</strong></p>

              {/* Show incredible Live Animated Map dynamically tied to the context coords */}
              {idx === 0 && (
                 <div className="map-container-wrapper">
                    <LiveMap status={order.status} homeCoords={coords} />
                 </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
