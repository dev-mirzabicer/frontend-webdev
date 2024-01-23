import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { AxiosError } from 'axios';
import "./Register.css";

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    avatar: ''
  });
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await apiService.post('/auth/register', userData);
      const { user, tokens } = response.data.data;
      login(user, tokens);
      navigate('/');
    } catch (error) {
        const axiosError = error instanceof AxiosError ? error as AxiosError : undefined;
        const message = axiosError ? (axiosError.response?.data as any)?.message : "Unknown error";
        setError('Registration error: ' + message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center register-container">
      <Card className="auth-card">
        <Card.Body>
          <h2 className="text-center">Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            type="text" 
            name="username" 
            value={userData.username} 
            onChange={handleChange} 
            placeholder="Username" 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            name="name" 
            value={userData.name} 
            onChange={handleChange} 
            placeholder="Name" 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            name="email" 
            value={userData.email} 
            onChange={handleChange} 
            placeholder="Email" 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            name="password" 
            value={userData.password} 
            onChange={handleChange} 
            placeholder="Password" 
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-3">Register</Button>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Form>
      </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
