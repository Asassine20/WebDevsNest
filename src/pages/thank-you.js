import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/ThankYou.module.css';

export default function ThankYou() {
  const router = useRouter();
  const { type } = router.query;

  const message = type === 'advertise' 
    ? 'Thank you for your interest in advertising with us! We will review your inquiry and get back to you within 1-2 business days.'
    : 'Thank you for reaching out! We will review your message and get back to you within 1-2 business days.';

  return (
    <div className={styles.container}>
      <div className={styles.thankYouWrapper}>
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </Link>
        <h1>Thank You!</h1>
        <p>{message}</p>
        <Link href="/" className={styles.btn}>Return Home</Link>
      </div>
    </div>
  );
}
