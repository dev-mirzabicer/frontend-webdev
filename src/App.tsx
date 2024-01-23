import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import PostDetail from './components/PostDetail';
import Feed from './components/Feed';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Profile from './components/Profile';

const App = () => {
  return (
    <Router>
      <AuthProvider>
      <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/create" element={<CreatePost />}/>
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/posts/edit/:postId" element={<EditPost />} />
          <Route path="profile/:userId" element={<Profile />}/>
          {/* Add other routes as necessary */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

// ProtectedRoute component to guard routes that require authentication
const ProtectedRoute = ({ children, requiredRoles }: any) => {
    const { isAuthenticated, user } = useAuth();
  
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return <div>Access denied. Insufficient permissions.</div>;
    }
  
    return children;
  };

export default App;