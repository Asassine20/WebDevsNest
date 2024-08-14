import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMessage('A reset link has been sent to your email address.');
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="card p-4">
          <div className="d-flex justify-content-center mb-4">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={100} height={50} />
            </Link>
          </div>
          <h1 className="text-center">Forgot Password</h1>
          {message && (
            <div className="alert alert-success text-center mx-auto" style={{ maxWidth: '400px' }}>
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: '400px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
          </form>
          <p className="text-center mt-3">
            Remembered your password? <Link href="/login" className="custom-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
