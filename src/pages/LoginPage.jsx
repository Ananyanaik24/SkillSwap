import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPage.css';
import { AuthContext } from '../context/AuthContext';  // Ensure this is where your context is created
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // Use context for managing user state

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5003/api/login', { email, password });
      
      if (response.data.token) {
        // Store token and user data in local storage
        localStorage.clear("userId");
        localStorage.setItem("userId", response.data.user.id);
        console.log("UserId:",response.data.user.id)
       // localStorage.setItem('userId', userId);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));  // Save user for welcome message
        setUser(response.data.user);  // Update context state

        setSuccessMessage(`Login successful! Welcome back, ${response.data.user.name}.`);
        setError('');  // Clear any previous error

        // Redirect after a short delay for the success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(response.data.message);
        setSuccessMessage('');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setSuccessMessage('');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back 👋</h2>
      <p>Login to your SkillSwap account</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <button type="submit" className="login-btn">Login</button>
        <div className="login-footer">
          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          <p>Don’t have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
