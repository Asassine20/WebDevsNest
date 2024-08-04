import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import styles from '../../Styles/Dashboard.module.css';

export default function Dashboard() {
  const { data: user, error: userError } = useSWR('/api/auth/user', fetcher);
  const { data: streakData, error: streakError } = useSWR(user ? `/api/visit?userId=${user.Id}` : null, fetcher);

  useEffect(() => {
    if (userError) {
      Router.push('/login');
    }
  }, [user, userError]);

  if (!user) return <div>Loading...</div>;
  if (userError || streakError) return <div>Error loading dashboard</div>;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    Router.push('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>Welcome, {user.Name}</h1>
      <div className={styles.visitBox}>
        <h2>{streakData?.streak || 0}</h2>
        <p>Days in a row you've visited the website</p>
      </div>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
