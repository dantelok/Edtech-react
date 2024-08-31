import React, { createContext, useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initialize as null when not logged in
    // const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in by checking the token
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({ token });
        return <Navigate to="/" />; // Redirect to home after login
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        return <Navigate to="/signin" />; // Redirect to signin after logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;