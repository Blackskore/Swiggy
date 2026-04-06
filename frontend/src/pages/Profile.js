import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Orders from "./Orders";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [addresses, setAddresses] = useState([
     { id: 1, type: "Home", text: "123 Main St, Bangalore, 560001" },
     { id: 2, type: "Work", text: "Tech Park, Whitefield, Bangalore" }
  ]);
  const [cards, setCards] = useState([
     { id: 1, last4: "4242", type: "Visa", expiry: "12/24" }
  ]);
  const [swiggyOneSubscribed, setSwiggyOneSubscribed] = useState(false);

  if (!user) {
    return (
      <div className="empty-state" style={{marginTop: "50px"}}>
        <h2>You are not logged in</h2>
        <Link to="/auth" style={{display: "inline-block", marginTop: "30px", padding: "12px 20px", backgroundColor: "#fc8019", color: "white", textDecoration: "none", fontWeight: "bold", borderRadius: "4px"}}>LOG IN</Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { id: "orders", icon: "📦", label: "Orders" },
    { id: "swiggyOne", icon: "👑", label: "Swiggy One", badge: "NEW" },
    { id: "favourites", icon: "❤️", label: "Favourites" },
    { id: "payments", icon: "💳", label: "Payments" },
    { id: "addresses", icon: "📍", label: "Addresses" },
    { id: "profile", icon: "⚙️", label: "Settings" }
  ];

  return (
    <div style={{
        background: "linear-gradient(135deg, #1e202c 0%, #2c3147 100%)", 
        padding: "60px 0", 
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden"
    }}>
      {/* Abstract ambient orbs for a premium tech aesthetic */}
      <div style={{ position: "absolute", width: "600px", height: "600px", background: "rgba(252, 128, 25, 0.15)", filter: "blur(100px)", borderRadius: "50%", top: "-20%", left: "-10%", zIndex: 0 }}></div>
      <div style={{ position: "absolute", width: "500px", height: "500px", background: "rgba(74, 144, 226, 0.15)", filter: "blur(120px)", borderRadius: "50%", bottom: "-10%", right: "-10%", zIndex: 0 }}></div>
      
      <div className="profile-container" style={{maxWidth: "1000px", margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1}}>
        <div style={{display: "flex", gap: "20px", alignItems: "center", color: "white", marginBottom: "40px"}}>
          <div style={{width: "100px", height: "100px", borderRadius: "50%", background: "#fff", color: "#37718e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "42px", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.15)"}}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{fontSize: "32px", margin: 0}}>{user.name}</h2>
            <p style={{margin: "5px 0 0 0", opacity: 0.9, fontSize: "16px"}}>{user.email}</p>
          </div>
        </div>

        <div style={{display: "flex", background: "white", borderRadius: "12px", overflow: "hidden", minHeight: "500px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)"}}>
          
          <div className="profile-sidebar" style={{flex: "0 0 280px", background: "#edf1f7", padding: "0", display: "flex", flexDirection: "column"}}>
            <ul style={{listStyle: "none", padding: "20px 0", margin: 0, fontSize: "16px", flex: 1}}>
              {menuItems.map(item => (
                <li key={item.id} 
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      padding: "18px 30px", 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "15px",
                      background: activeTab === item.id ? "white" : "transparent",
                      borderLeft: activeTab === item.id ? "4px solid #fc8019" : "4px solid transparent",
                      color: activeTab === item.id ? "#282c3f" : "#3d4152",
                      fontWeight: activeTab === item.id ? "bold" : "600",
                      transition: "all 0.2s"
                    }}>
                  <span style={{fontSize: "20px"}}>{item.icon}</span> 
                  <span>{item.label}</span>
                  {item.badge && <span style={{marginLeft: "auto", fontSize: "11px", background: "#fc8019", color: "white", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold"}}>{item.badge}</span>}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="profile-content" style={{flex: 1, padding: "40px"}}>
            {activeTab === "profile" && (
              <div style={{animation: "fadeIn 0.3s ease-in-out"}}>
                <h3 style={{fontSize: "24px", marginBottom: "30px", color: "#282c3f"}}>Edit Profile</h3>
                <div>
                  <div style={{marginBottom: "20px"}}>
                    <label style={{color: "#7e808c", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px"}}>Full Name</label>
                    <input type="text" value={user.name} readOnly style={{width: "100%", padding: "12px 0", border: "none", borderBottom: "1px solid #d4d5d9", outline: "none", fontSize: "16px", color: "#282c3f", background: "transparent"}} />
                  </div>
                  <div style={{marginBottom: "20px"}}>
                    <label style={{color: "#7e808c", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px"}}>Email Address</label>
                    <input type="email" value={user.email} readOnly style={{width: "100%", padding: "12px 0", border: "none", borderBottom: "1px solid #d4d5d9", outline: "none", fontSize: "16px", color: "#282c3f", background: "transparent"}} />
                  </div>
                  <div style={{marginBottom: "40px"}}>
                    <label style={{color: "#7e808c", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px"}}>Phone Number</label>
                    <input type="text" placeholder="No phone number added" readOnly style={{width: "100%", padding: "12px 0", border: "none", borderBottom: "1px solid #d4d5d9", outline: "none", fontSize: "16px", color: "#282c3f", background: "transparent"}} />
                  </div>
                  <button onClick={handleLogout} style={{padding: "14px 40px", backgroundColor: "#fff", border: "1px solid #fc8019", color: "#fc8019", fontWeight: "bold", fontSize: "16px", borderRadius: "4px", cursor: "pointer", transition: "all 0.2s"}}>
                    LOGOUT
                  </button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div style={{animation: "fadeIn 0.3s ease-in-out"}}>
                 <Orders isProfileEmbedded={true} />
              </div>
            )}

            {activeTab === "swiggyOne" && (
              <div style={{animation: "fadeIn 0.3s ease-in-out"}}>
                <div style={{background: "linear-gradient(135deg, #f09b53, #fc8019)", color: "white", padding: "40px", borderRadius: "12px", textAlign: "center"}}>
                   <h2 style={{fontSize: "36px", marginBottom: "15px"}}>👑 Swiggy One</h2>
                   {swiggyOneSubscribed ? (
                     <div>
                       <h3 style={{fontSize: "24px", marginBottom: "15px"}}>You're a member!</h3>
                       <p style={{fontSize: "16px"}}>Enjoy free deliveries and exclusive discounts on all orders.</p>
                     </div>
                   ) : (
                     <div>
                       <p style={{fontSize: "18px", marginBottom: "25px"}}>Get unlimited free deliveries and extra discounts!</p>
                       <button onClick={() => setSwiggyOneSubscribed(true)} style={{padding: "16px 40px", fontSize: "18px", background: "white", color: "#fc8019", border: "none", borderRadius: "30px", fontWeight: "bold", cursor: "pointer"}}>Get it for ₹149/mo</button>
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeTab === "favourites" && (
              <div style={{animation: "fadeIn 0.3s ease-in-out"}}>
                 <h3 style={{fontSize: "24px", marginBottom: "30px", color: "#282c3f"}}>❤️ Favourites</h3>
                 <div style={{textAlign: "center", padding: "60px 40px", border: "1px dashed #d4d5d9", borderRadius: "8px"}}>
                    <span style={{fontSize: "48px", opacity: 0.5}}>🍽️</span>
                    <h4 style={{fontSize: "20px", color: "#3d4152", margin: "20px 0 10px 0"}}>No favourites yet</h4>
                    <p style={{color: "#7e808c"}}>Mark restaurants as favourites to see them here.</p>
                 </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div style={{animation: "fadeIn 0.3s ease-in-out"}}>
                 <h3 style={{fontSize: "24px", marginBottom: "30px", color: "#282c3f"}}>💳 Saved Cards</h3>
                 {cards.length === 0 && <p style={{color: "#7e808c"}}>No cards saved.</p>}
                 {cards.map(c => (
                   <div key={c.id} style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", border: "1px solid #d4d5d9", borderRadius: "8px", marginBottom: "15px"}}>
                     <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                        <div style={{width: "50px", height: "35px", background: "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", borderRadius: "4px", color: "#282c3f"}}>{c.type}</div>
                        <div>
                          <p style={{fontWeight: "bold", margin: 0, color: "#282c3f"}}>{c.type} ending in {c.last4}</p>
                          <p style={{color: "#7e808c", fontSize: "12px", margin: "5px 0 0 0"}}>Expires {c.expiry}</p>
                        </div>
                     </div>
                     <button style={{background: "transparent", color: "#fc8019", border: "none", fontWeight: "bold", cursor: "pointer"}} onClick={() => setCards(cards.filter(card => card.id !== c.id))}>REMOVE</button>
                   </div>
                 ))}
                 <button style={{marginTop: "20px", padding: "16px 20px", border: "1px dashed #fc8019", background: "transparent", color: "#fc8019", fontWeight: "bold", borderRadius: "4px", cursor: "pointer", width: "100%", fontSize: "14px"}}>+ ADD NEW CARD</button>
              </div>
            )}

            {activeTab === "addresses" && (
              <div style={{animation: "fadeIn 0.3s ease-in-out"}}>
                 <h3 style={{fontSize: "24px", marginBottom: "30px", color: "#282c3f"}}>📍 Saved Addresses</h3>
                 <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px"}}>
                   {addresses.map(a => (
                     <div key={a.id} style={{padding: "25px", border: "1px solid #d4d5d9", borderRadius: "8px", position: "relative", boxShadow: "0 2px 4px rgba(0,0,0,0.02)"}}>
                       <span style={{position: "absolute", top: "25px", right: "20px", fontSize: "20px"}}>{a.type === "Home" ? "🏠" : "🏢"}</span>
                       <h4 style={{margin: "0 0 15px 0", color: "#282c3f", fontSize: "18px"}}>{a.type}</h4>
                       <p style={{color: "#7e808c", fontSize: "14px", lineHeight: "1.6"}}>{a.text}</p>
                       <div style={{display: "flex", gap: "20px", marginTop: "25px"}}>
                         <button style={{background: "transparent", border: "none", color: "#fc8019", fontWeight: "bold", cursor: "pointer", padding: 0, fontSize: "13px"}}>EDIT</button>
                         <button onClick={() => setAddresses(addresses.filter(addr => addr.id !== a.id))} style={{background: "transparent", border: "none", color: "#fc8019", fontWeight: "bold", cursor: "pointer", padding: 0, fontSize: "13px"}}>DELETE</button>
                       </div>
                     </div>
                   ))}
                   <div style={{padding: "20px", border: "1px dashed #fc8019", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", minHeight: "150px", background: "#fef6f3"}}>
                     <span style={{color: "#fc8019", fontWeight: "bold", fontSize: "14px"}}>+ ADD NEW ADDRESS</span>
                   </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
