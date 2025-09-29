'use client';
import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    alert('Login functionality would go here');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007acc', color: 'white', border: 'none' }}>
          Login
        </button>
      </form>
    </div>
  );
}
