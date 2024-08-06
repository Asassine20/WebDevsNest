import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      setMessage('Your password has been reset successfully.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="card p-4">
          <h1 className="text-center">Reset Password</h1>
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
              <label htmlFor="password" className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Reset Password</button>
          </form>
          <p className="text-center mt-3">
            Remembered your password? <Link href="/login" className="custom-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
