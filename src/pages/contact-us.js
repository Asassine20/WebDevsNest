import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/AuthForm.module.css';

export default function ContactUs() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/contact-us', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, subject, content }),
    });
  
    if (res.ok) {
      Router.push('/thank-you?type=contact');
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };
  

  return (
    <div className={styles.container}>
<div className={styles.authWrapper} style={{ maxWidth: '500px', padding: '20px', margin: '25px auto' }}>
        <button className={styles.closeButton} onClick={() => Router.push('/')}>×</button>
        <div className={styles.authForm}>
          <div className="d-flex justify-content-center mb-4">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={100} height={100} />
            </Link>
          </div>
          <h1 className="text-center text-bs-dark">Contact Us</h1>
          {error && (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: '400px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-4">
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
              <label htmlFor="subject" className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="5"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Send Message</button>
          </form>
          <p className="text-center mt-3">
            We typically respond within 1-2 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
