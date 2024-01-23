import React, { createContext, useContext, useState, useEffect } from 'react';
import UserService from '../services/UserService';
import { AxiosError } from 'axios';
import { Spinner } from 'react-bootstrap';
// import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Define a proper user type
  login: (userData: any, tokensData: any) => void;
  logout: () => void;
  getUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const getUser = async () => {
    try {
    const me = await UserService.getUserProfile();
    setUser(me.data.data.user);
    console.log(me.data);
    
    } catch (error) {
        console.log((error as AxiosError).toJSON);
        console.log(error);
    }
    };
  useEffect(() => {
    // Check for tokens in cookies on initial load
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
      getUser().finally(() => setLoading(false));
      // Optionally, retrieve user info from the server using accessToken
    }
    else {
        setLoading(false);
      }
  }, []);

  const login = (userData: any, tokensData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Store tokens in cookies
    localStorage.setItem('accessToken', tokensData.access.token );
    localStorage.setItem('refreshToken', tokensData.refresh.token );
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear tokens from cookies
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  if(loading) return <div className="text-center"><Spinner animation="border" /></div>

  return (
    <AuthContext.Provider value={{ getUser, isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
