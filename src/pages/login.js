import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/AuthForm.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = '/profile/dashboard'; // Redirect to dashboard with page refresh
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authWrapper}>
        <button className={styles.closeButton} onClick={() => Router.push('/')}>×</button>
        <div className={styles.authPerks}>
          <h2>Perks of Joining</h2>
          <ul>
            <li>It's free to join, and free to use</li>
            <li>Get access to a personalized dashboard</li>
            <li>Create a public and shareable portfolio to display your work experience, projects, awards, and more</li>
            <li>Keep track of how often you learn on WebDevsNest</li>
            <li>Opt in to receive notifications about new posts</li>
            <li>Set goals for your learning path</li>
          </ul>
        </div>
        <div className={styles.authForm}>
          <div className="d-flex justify-content-center mb-4">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={100} height={50} />
            </Link>
          </div>
          <h1 className="text-center text-bs-dark">Login</h1>
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
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <p className="text-center mt-3">
            Don't have an account? <Link href="/signup" className="custom-link">Sign Up</Link>
          </p>
          <p className="text-center mt-3">
            <Link href="/forgot-password" className="custom-link">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
