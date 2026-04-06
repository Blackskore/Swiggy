import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Instantly attach active Global Interceptor ensuring every single outgoing Frontend request strictly holds User Bearer signatures 
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState("Bangalore, Karnataka, India");
    const [coords, setCoords] = useState([12.9716, 77.5946]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("/auth/me")
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, currentLocation, setCurrentLocation, coords, setCoords }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
