// pages/verify.js
import Link from 'next/link';
import styles from '../styles/Verify.module.css';

export default function Verify() {
  return (
    <div className={styles.container}>
      <div className={styles.authWrapper}>
        <h1 className="text-center">Verify Your Email</h1>
        <p className="text-center">
          A verification link has been sent to your email address. Please check your email and follow the link to verify your account.
        </p>
        <Link href="/" passHref>
          <button className="btn btn-primary w-100 mt-4">Go to Home</button>
        </Link>
      </div>
    </div>
  );
}
