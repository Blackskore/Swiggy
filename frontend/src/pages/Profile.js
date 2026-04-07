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
  const [hoveredTab, setHoveredTab] = useState(null);

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
    { id: "profile", icon: "⚙️", label: "Settings" },
    { id: "orders", icon: "📦", label: "Orders" },
    { id: "swiggyOne", icon: "👑", label: "Swiggy One", badge: "NEW" },
    { id: "favourites", icon: "❤️", label: "Favourites" },
    { id: "payments", icon: "💳", label: "Payments" },
    { id: "addresses", icon: "📍", label: "Addresses" }
  ];

  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.3)"
  };

  return (
    <div style={{
        backgroundColor: "#0d0f14",
        backgroundImage: "radial-gradient(circle at 15% 50%, rgba(252, 128, 25, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(74, 144, 226, 0.15), transparent 25%)",
        padding: "60px 0", 
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif"
    }}>
      {/* Abstract ambient orbs for a premium tech aesthetic */}
      <div style={{ position: "absolute", width: "600px", height: "600px", background: "rgba(252, 128, 25, 0.1)", filter: "blur(120px)", borderRadius: "50%", top: "-10%", left: "-10%", zIndex: 0, animation: "pulse 8s infinite alternate" }}></div>
      <div style={{ position: "absolute", width: "500px", height: "500px", background: "rgba(138, 43, 226, 0.1)", filter: "blur(120px)", borderRadius: "50%", bottom: "-10%", right: "-10%", zIndex: 0, animation: "pulse 10s infinite alternate-reverse" }}></div>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(1.1); opacity: 0.9; }
          }
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .profile-tab-content {
            animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          /* Hide scrollbar for a cleaner look */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.02);
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.2);
          }
        `}
      </style>
      
      <div className="profile-container" style={{maxWidth: "1100px", margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1}}>
        
        {/* User Header */}
        <div style={{display: "flex", gap: "25px", alignItems: "center", color: "white", marginBottom: "40px", ...glassCardStyle, padding: "30px", borderRadius: "30px", background: "rgba(255,255,255,0.03)"}}>
          <div style={{
            width: "90px", 
            height: "90px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #fc8019, #ff9b44)", 
            color: "white", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: "40px", 
            fontWeight: "800",
            boxShadow: "0 10px 25px rgba(252, 128, 25, 0.4)",
            border: "2px solid rgba(255,255,255,0.2)"
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{fontSize: "36px", margin: 0, fontWeight: "700", letterSpacing: "-1px"}}>{user.name}</h2>
            <p style={{margin: "8px 0 0 0", color: "rgba(255,255,255,0.7)", fontSize: "16px", display: "flex", alignItems: "center", gap: "6px"}}>
              <span style={{fontSize: "18px"}}>✉️</span> {user.email}
            </p>
          </div>
          <div style={{marginLeft: "auto", padding: "12px 24px", background: "rgba(255,255,255,0.05)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)"}}>
             <p style={{margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px"}}>Member Since</p>
             <p style={{margin: "4px 0 0 0", fontSize: "16px", fontWeight: "600", color: "#fff"}}>2026</p>
          </div>
        </div>

        <div style={{display: "flex", gap: "30px", minHeight: "600px"}}>
          
          {/* Sidebar */}
          <div style={{flex: "0 0 280px", ...glassCardStyle, padding: "20px 0", display: "flex", flexDirection: "column"}}>
            <ul style={{listStyle: "none", padding: "0", margin: 0, overflow: "hidden"}}>
              {menuItems.map(item => (
                <li key={item.id} 
                    onClick={() => setActiveTab(item.id)}
                    onMouseEnter={() => setHoveredTab(item.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    style={{
                      padding: "16px 30px", 
                      margin: "8px 15px",
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "16px",
                      borderRadius: "16px",
                      background: activeTab === item.id 
                        ? "linear-gradient(90deg, rgba(252, 128, 25, 0.15), rgba(252, 128, 25, 0))" 
                        : hoveredTab === item.id ? "rgba(255, 255, 255, 0.05)" : "transparent",
                      borderLeft: activeTab === item.id ? "4px solid #fc8019" : "4px solid transparent",
                      color: activeTab === item.id ? "#fff" : "rgba(255,255,255,0.6)",
                      fontWeight: activeTab === item.id ? "700" : "500",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative"
                    }}>
                  <span style={{
                    fontSize: "20px", 
                    filter: activeTab === item.id ? "drop-shadow(0 0 8px rgba(252, 128, 25, 0.8))" : "none",
                    transform: (hoveredTab === item.id || activeTab === item.id) ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.3s ease, filter 0.3s ease"
                  }}>{item.icon}</span> 
                  <span style={{fontSize: "16px"}}>{item.label}</span>
                  {item.badge && <span style={{
                    marginLeft: "auto", 
                    fontSize: "10px", 
                    background: "linear-gradient(135deg, #fc8019, #e66000)", 
                    color: "white", 
                    padding: "3px 8px", 
                    borderRadius: "12px", 
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px rgba(252, 128, 25, 0.4)"
                  }}>{item.badge}</span>}
                </li>
              ))}
            </ul>
            
            <div style={{marginTop: "auto", padding: "20px 30px"}}>
               <button onClick={handleLogout} style={{
                 width: "100%", 
                 padding: "16px", 
                 background: "rgba(252, 128, 25, 0.1)", 
                 border: "1px solid rgba(252, 128, 25, 0.3)", 
                 color: "#fc8019", 
                 fontWeight: "bold", 
                 fontSize: "15px", 
                 borderRadius: "16px", 
                 cursor: "pointer", 
                 transition: "all 0.3s ease",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 gap: "10px"
               }}
               onMouseEnter={e => {
                 e.currentTarget.style.background = "rgba(252, 128, 25, 0.2)";
                 e.currentTarget.style.boxShadow = "0 8px 20px rgba(252, 128, 25, 0.2)";
               }}
               onMouseLeave={e => {
                 e.currentTarget.style.background = "rgba(252, 128, 25, 0.1)";
                 e.currentTarget.style.boxShadow = "none";
               }}
               >
                 <span>🚪</span> LOGOUT
               </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div style={{flex: 1, ...glassCardStyle, padding: "40px 50px", overflowY: "auto"}}>
            
            {activeTab === "profile" && (
              <div key="profile" className="profile-tab-content">
                <h3 style={{fontSize: "28px", margin: "0 0 40px 0", color: "#fff", fontWeight: "700"}}>Account Settings</h3>
                
                <div style={{display: "grid", gap: "30px"}}>
                  <div style={{background: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)"}}>
                    <label style={{color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "8px"}}>Full Name</label>
                    <input type="text" value={user.name} readOnly style={{width: "100%", padding: "10px 0", border: "none", outline: "none", fontSize: "18px", color: "#fff", background: "transparent", fontWeight: "500"}} />
                  </div>
                  
                  <div style={{background: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)"}}>
                    <label style={{color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "8px"}}>Email Address</label>
                    <input type="email" value={user.email} readOnly style={{width: "100%", padding: "10px 0", border: "none", outline: "none", fontSize: "18px", color: "#fff", background: "transparent", fontWeight: "500"}} />
                  </div>
                  
                  <div style={{background: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)"}}>
                    <label style={{color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "8px"}}>Phone Number</label>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <input type="text" placeholder="Add phone number" readOnly style={{width: "80%", padding: "10px 0", border: "none", outline: "none", fontSize: "18px", color: "rgba(255,255,255,0.5)", background: "transparent", fontWeight: "500"}} />
                      <button style={{background: "none", border: "none", color: "#fc8019", cursor: "pointer", fontWeight: "bold"}}>ADD</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div key="orders" className="profile-tab-content">
                 <h3 style={{fontSize: "28px", margin: "0 0 30px 0", color: "#fff", fontWeight: "700"}}>Order History</h3>
                 <div style={{background: "rgba(255,255,255,0.9)", borderRadius: "20px", padding: "20px", color: "#000"}}>
                    {/* Wrapping Orders for contrast since Orders.js might have light mode styles */}
                    <Orders isProfileEmbedded={true} />
                 </div>
              </div>
            )}

            {activeTab === "swiggyOne" && (
              <div key="swiggyOne" className="profile-tab-content" style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div style={{
                  background: "linear-gradient(135deg, rgba(252, 128, 25, 0.2), rgba(252, 128, 25, 0.05))", 
                  border: "1px solid rgba(252, 128, 25, 0.3)",
                  boxShadow: "0 20px 50px rgba(252, 128, 25, 0.15)",
                  color: "white", 
                  padding: "50px", 
                  borderRadius: "30px", 
                  textAlign: "center",
                  maxWidth: "500px",
                  backdropFilter: "blur(20px)"
                }}>
                   <div style={{fontSize: "64px", marginBottom: "20px", animation: "pulse 2s infinite"}}>👑</div>
                   <h2 style={{fontSize: "36px", marginBottom: "15px", fontWeight: "800", background: "linear-gradient(90deg, #fff, #ffe0b2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Swiggy One</h2>
                   
                   {swiggyOneSubscribed ? (
                     <div style={{marginTop: "30px"}}>
                       <div style={{display: "inline-block", background: "rgba(46, 204, 113, 0.2)", color: "#2ecc71", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold", marginBottom: "20px", border: "1px solid rgba(46, 204, 113, 0.3)"}}>
                         ✓ ACTIVE MEMBER
                       </div>
                       <p style={{fontSize: "18px", color: "rgba(255,255,255,0.8)", lineHeight: "1.6"}}>You are enjoying unlimited free deliveries and exclusive VIP discounts.</p>
                     </div>
                   ) : (
                     <div style={{marginTop: "30px"}}>
                       <p style={{fontSize: "18px", marginBottom: "35px", color: "rgba(255,255,255,0.8)", lineHeight: "1.6"}}>Unlock unlimited free deliveries & extra discounts on all your favorite restaurants.</p>
                       <button onClick={() => setSwiggyOneSubscribed(true)} style={{
                         padding: "18px 40px", 
                         fontSize: "18px", 
                         background: "linear-gradient(135deg, #fc8019, #e66000)", 
                         color: "#fff", 
                         border: "none", 
                         borderRadius: "30px", 
                         fontWeight: "800", 
                         cursor: "pointer",
                         boxShadow: "0 10px 25px rgba(252, 128, 25, 0.4)",
                         transition: "transform 0.2s, box-shadow 0.2s"
                       }}
                       onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)";  e.currentTarget.style.boxShadow = "0 15px 30px rgba(252, 128, 25, 0.5)"}}
                       onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";  e.currentTarget.style.boxShadow = "0 10px 25px rgba(252, 128, 25, 0.4)"}}
                       >
                         Get it for ₹149/mo
                       </button>
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeTab === "favourites" && (
              <div key="favourites" className="profile-tab-content">
                 <h3 style={{fontSize: "28px", margin: "0 0 30px 0", color: "#fff", fontWeight: "700"}}>Favourites</h3>
                 <div style={{textAlign: "center", padding: "80px 40px", background: "rgba(0,0,0,0.2)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "24px"}}>
                    <span style={{fontSize: "64px", filter: "grayscale(1) opacity(0.5)"}}>🍽️</span>
                    <h4 style={{fontSize: "24px", color: "#fff", margin: "20px 0 10px 0", fontWeight: "600"}}>No favourites yet</h4>
                    <p style={{color: "rgba(255,255,255,0.5)", fontSize: "16px"}}>You haven't liked any restaurants. Go explore to find your new favourite spot!</p>
                    <button style={{marginTop: "30px", padding: "14px 30px", background: "white", color: "#000", fontWeight: "bold", border: "none", borderRadius: "20px", cursor: "pointer"}} onClick={() => navigate("/")}>Explore Restaurants</button>
                 </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div key="payments" className="profile-tab-content">
                 <h3 style={{fontSize: "28px", margin: "0 0 30px 0", color: "#fff", fontWeight: "700"}}>Payment Methods</h3>
                 
                 {cards.length === 0 ? (
                   <p style={{color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px", background: "rgba(0,0,0,0.2)", borderRadius: "16px"}}>No cards saved.</p>
                 ) : (
                   <div style={{display: "grid", gap: "20px"}}>
                     {cards.map(c => (
                       <div key={c.id} style={{
                         display: "flex", 
                         justifyContent: "space-between", 
                         alignItems: "center", 
                         padding: "25px", 
                         background: "rgba(0,0,0,0.3)", 
                         border: "1px solid rgba(255,255,255,0.05)", 
                         borderRadius: "20px",
                         transition: "transform 0.2s"
                       }}
                       onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                       onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                       >
                         <div style={{display: "flex", alignItems: "center", gap: "20px"}}>
                            <div style={{
                              width: "60px", 
                              height: "40px", 
                              background: "linear-gradient(135deg, #fff, #f0f0f0)", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              fontWeight: "900", 
                              borderRadius: "6px", 
                              color: "#1a1f36",
                              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                              fontStyle: "italic"
                            }}>{c.type}</div>
                            <div>
                              <p style={{fontWeight: "600", margin: 0, color: "#fff", fontSize: "18px"}}>{c.type} **** {c.last4}</p>
                              <p style={{color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: "6px 0 0 0"}}>Expires {c.expiry}</p>
                            </div>
                         </div>
                         <button style={{
                           background: "rgba(255,0,0,0.1)", 
                           color: "#ff4757", 
                           border: "1px solid rgba(255,0,0,0.2)", 
                           padding: "8px 16px",
                           borderRadius: "10px",
                           fontWeight: "bold", 
                           cursor: "pointer",
                           transition: "all 0.2s"
                         }} 
                         onClick={() => setCards(cards.filter(card => card.id !== c.id))}
                         onMouseEnter={e => e.currentTarget.style.background = "rgba(255,0,0,0.2)"}
                         onMouseLeave={e => e.currentTarget.style.background = "rgba(255,0,0,0.1)"}
                         >Remove</button>
                       </div>
                     ))}
                   </div>
                 )}
                 
                 <button style={{
                   marginTop: "30px", 
                   padding: "20px", 
                   border: "2px dashed rgba(252, 128, 25, 0.4)", 
                   background: "rgba(252, 128, 25, 0.05)", 
                   color: "#fc8019", 
                   fontWeight: "bold", 
                   borderRadius: "20px", 
                   cursor: "pointer", 
                   width: "100%", 
                   fontSize: "16px",
                   transition: "all 0.2s"
                 }}
                 onMouseEnter={e => e.currentTarget.style.background = "rgba(252, 128, 25, 0.1)"}
                 onMouseLeave={e => e.currentTarget.style.background = "rgba(252, 128, 25, 0.05)"}
                 >
                   + ADD NEW PAYMENT METHOD
                 </button>
              </div>
            )}

            {activeTab === "addresses" && (
              <div key="addresses" className="profile-tab-content">
                 <h3 style={{fontSize: "28px", margin: "0 0 30px 0", color: "#fff", fontWeight: "700"}}>Saved Addresses</h3>
                 <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px"}}>
                   {addresses.map(a => (
                     <div key={a.id} style={{
                       padding: "30px", 
                       background: "rgba(0,0,0,0.3)", 
                       border: "1px solid rgba(255,255,255,0.05)", 
                       borderRadius: "24px", 
                       position: "relative",
                       transition: "transform 0.2s"
                     }}
                     onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                     onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                     >
                       <div style={{
                         position: "absolute", 
                         top: "25px", 
                         right: "25px", 
                         fontSize: "24px",
                         background: "rgba(255,255,255,0.05)",
                         width: "45px",
                         height: "45px",
                         display: "flex",
                         alignItems: "center",
                         justifyContent: "center",
                         borderRadius: "50%"
                       }}>{a.type === "Home" ? "🏠" : "🏢"}</div>
                       
                       <h4 style={{margin: "0 0 15px 0", color: "#fff", fontSize: "20px", fontWeight: "600"}}>{a.type}</h4>
                       <p style={{color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: "1.7", minHeight: "50px"}}>{a.text}</p>
                       
                       <div style={{display: "flex", gap: "10px", marginTop: "25px"}}>
                         <button style={{flex: 1, padding: "10px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", border: "none", color: "#fff", fontWeight: "600", cursor: "pointer"}}>Edit</button>
                         <button onClick={() => setAddresses(addresses.filter(addr => addr.id !== a.id))} style={{flex: 1, padding: "10px", background: "rgba(255,0,0,0.15)", borderRadius: "10px", border: "none", color: "#ff4757", fontWeight: "600", cursor: "pointer"}}>Delete</button>
                       </div>
                     </div>
                   ))}
                   
                   <div style={{
                     padding: "20px", 
                     border: "2px dashed rgba(255,255,255,0.15)", 
                     borderRadius: "24px", 
                     display: "flex", 
                     flexDirection: "column",
                     alignItems: "center", 
                     justifyContent: "center", 
                     cursor: "pointer", 
                     minHeight: "220px", 
                     background: "rgba(0,0,0,0.1)",
                     transition: "background 0.2s"
                   }}
                   onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.2)"}
                   onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.1)"}
                   >
                     <div style={{fontSize: "32px", color: "rgba(255,255,255,0.4)", marginBottom: "15px"}}>+</div>
                     <span style={{color: "rgba(255,255,255,0.6)", fontWeight: "600", fontSize: "16px"}}>Add New Address</span>
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
