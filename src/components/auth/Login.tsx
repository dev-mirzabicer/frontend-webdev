import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Alert, Card } from 'react-bootstrap'; // Assuming Bootstrap usage
import { AxiosError } from 'axios';
import "./Login.css";

const Login = () => {
const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
  if(isAuthenticated) navigate("/");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await apiService.post('/auth/login', { email, password });
      const { user, tokens } = response.data.data;
      console.log("iefjhwekhckjesfhcksedhfckjsdefckjshd");
      console.log(response.data.data);
      login(user, tokens);
      navigate("/");
    } catch (error) {
        const axiosError = error instanceof AxiosError ? error as AxiosError : undefined;
        const message = axiosError ? (axiosError.response?.data as any)?.message : "Unknown error";
        setError('Error logging in: ' + message);
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center login-container">
      <Card className="login-card">
        <Card.Body>
          <h2 className="text-center">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-3">Login</Button>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Form>
      </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
