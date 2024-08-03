import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password }),
        });

        if (res.ok) {
            Router.push('/profile/dashboard');
        } else {
            const data = await res.json();
            setError(data.error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-center mb-4">
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={100} height={100} />
                </Link>
            </div>
            <h1 className="text-center text-bs-dark">Sign Up</h1>
            {error && (
                <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: '400px' }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4 mx-auto" style={{ maxWidth: '400px' }}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit" className="btn btn-primary w-100">Sign Up</button>
            </form>
            <p className="text-center mt-3">
                Already have an account? <Link href="/login" className="custom-link">Login</Link>
            </p>
        </div>
    );
}
