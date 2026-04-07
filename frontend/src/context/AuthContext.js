import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Attach Bearer token to every outgoing request
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const AuthContext = createContext();

// Reverse geocode GPS coords → city name using Nominatim (free, no key)
const reverseGeocode = async (lat, lon) => {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        const addr = data.address || {};
        return addr.city || addr.town || addr.village || addr.county || "Bengaluru";
    } catch {
        return "Bengaluru";
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // currentLocation = full display string (e.g. "Koramangala, Bengaluru")
    // selectedCity    = clean city name used for DB queries (e.g. "Bengaluru")
    const [currentLocation, setCurrentLocation] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [locationLoading, setLocationLoading] = useState(true);

    // Auto-detect GPS on mount
    useEffect(() => {
        if (!navigator.geolocation) {
            setCurrentLocation("Bengaluru");
            setSelectedCity("Bengaluru");
            setLocationLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const city = await reverseGeocode(latitude, longitude);
                setCurrentLocation(city);
                setSelectedCity(city);
                setLocationLoading(false);
            },
            () => {
                // GPS denied — leave blank so user picks manually
                setCurrentLocation("");
                setSelectedCity("");
                setLocationLoading(false);
            },
            { timeout: 8000, enableHighAccuracy: false }
        );
    }, []);

    // Auth
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("/auth/me")
                .then(res => { setUser(res.data); setLoading(false); })
                .catch(() => { localStorage.removeItem("token"); setLoading(false); });
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
        <AuthContext.Provider value={{
            user, login, logout, loading,
            currentLocation, setCurrentLocation,
            selectedCity, setSelectedCity,
            locationLoading,
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
