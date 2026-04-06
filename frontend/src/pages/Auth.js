import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post("/auth/login", {
          email, name: "User", password
        });
        login(res.data.access_token, res.data.user);
        navigate(-1); // Go back instantly cleanly
      } else {
        await axios.post("/auth/signup", {
          email, name, password
        });
        const loginRes = await axios.post("/auth/login", {
          email, name, password
        });
        login(loginRes.data.access_token, loginRes.data.user);
        navigate(-1);
      }
    } catch(err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 80px)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #e0e5ec 0%, #ffffff 100%)",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Glass Orbs */}
      <div style={{ position: "absolute", width: "400px", height: "400px", background: "rgba(252, 128, 25, 0.4)", filter: "blur(100px)", borderRadius: "50%", top: "-10%", left: "-5%", zIndex: 0 }}></div>
      <div style={{ position: "absolute", width: "500px", height: "500px", background: "rgba(55, 113, 142, 0.3)", filter: "blur(120px)", borderRadius: "50%", bottom: "-20%", right: "-10%", zIndex: 0 }}></div>

      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%", maxWidth: "420px",
        background: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        borderRadius: "24px",
        padding: "50px 40px",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow: "20px 20px 60px rgba(0,0,0,0.05), -20px -20px 60px rgba(255,255,255,0.8)"
      }}>
        <div style={{textAlign: "center", marginBottom: "40px"}}>
          <div style={{width: "65px", height: "65px", background: "#fc8019", color: "white", borderRadius: "18px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: "900", marginBottom: "20px", boxShadow: "8px 8px 16px rgba(252,128,25,0.3), -8px -8px 16px rgba(255,255,255,0.8)"}}>
            S
          </div>
          <h2 style={{fontSize: "32px", color: "#282c3f", fontWeight: "800", letterSpacing: "-1px"}}>{isLogin ? "Welcome Back" : "Join Swiggy"}</h2>
          <p style={{cursor: "pointer", color: "#fc8019", fontWeight: "700", marginTop: "8px", fontSize: "15px", transition: "all 0.2s"}} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "New here? Create an account" : "Already have an account? Login"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "20px"}}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="neo-input"
              value={name} onChange={e => setName(e.target.value)}
              required
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="neo-input"
            value={email} onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="neo-input"
            value={password} onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="neo-button" style={{marginTop: "10px"}}>
            {isLogin ? "SECURE LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
