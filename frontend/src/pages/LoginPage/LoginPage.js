import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    const defaultUsername = email.split('@')[0];

    const body = isLogin
      ? { email, password }
      : { username: defaultUsername, email, password };

    try {
      const response = await fetch(`https://orbital25-melodays.onrender.com/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(`${isLogin ? 'Login' : 'Sign up'} successful!`);

        const user = data.user;
        navigate(user.spotifyConnected ? '/home' : '/setupaccount');
      } else {
        alert(data.message || `${isLogin ? 'Login' : 'Sign up'} failed.`);
      }
    } catch (error) {
      console.error(`${endpoint} error:`, error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src="/logopurple.jpg" alt="Logo" className="login-logo" />

        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit" className="auth-button">
          {isLogin ? 'Log in' : 'Sign up'}
        </button>

        <button
          type="button"
          className="auth-button"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Switch to Sign up' : 'Switch to Log in'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;