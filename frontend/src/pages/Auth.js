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
        const res = await axios.post("http://127.0.0.1:8000/auth/login", {
          email, name: "User", password
        });
        login(res.data.access_token, res.data.user);
        navigate(-1); // Go back instantly cleanly
      } else {
        await axios.post("http://127.0.0.1:8000/auth/signup", {
          email, name, password
        });
        const loginRes = await axios.post("http://127.0.0.1:8000/auth/login", {
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
    <div className="auth-container box-shadow" style={{maxWidth: "450px", borderTop: "4px solid #fc8019"}}>
      <h2 style={{fontSize: "30px", marginBottom: "5px"}}>{isLogin ? "Login" : "Sign up"}</h2>
      <p style={{cursor: "pointer", color: "#fc8019", fontWeight: "bold", marginBottom: "30px", fontSize: "14px"}} onClick={() => setIsLogin(!isLogin)}>
        or {isLogin ? "create an account" : "login to your account"}
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Name" 
            className="auth-input pay-input" 
            style={{marginTop: 0}}
            value={name} onChange={e => setName(e.target.value)}
            required
          />
        )}
        <input 
          type="email" 
          placeholder="Email Address" 
          className="auth-input pay-input" 
          style={{marginTop: 0}}
          value={email} onChange={e => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="auth-input pay-input" 
          style={{marginTop: 0}}
          value={password} onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button pay-button" style={{marginTop: "20px"}}>
          {isLogin ? "LOGIN" : "SIGN UP"}
        </button>
      </form>
    </div>
  );
}

export default Auth;
