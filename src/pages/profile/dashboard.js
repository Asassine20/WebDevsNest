import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import Link from 'next/link';
import fetcher from '../../../lib/fetcher';
import styles from '../../Styles/Dashboard.module.css';

export default function Dashboard() {
  const { data: user, error: userError } = useSWR('/api/auth/user', fetcher);
  const { data: streakData, error: streakError } = useSWR(user ? `/api/visit?userId=${user.Id}` : null, fetcher);
  const { data: favoritesData, error: favoritesError } = useSWR(user ? `/api/userFavorites?userId=${user.Id}` : null, fetcher);

  useEffect(() => {
    if (userError) {
      Router.push('/login');
    }
  }, [user, userError]);

  if (!user) return <div>Loading...</div>;
  if (userError || streakError || favoritesError) return <div>Error loading dashboard</div>;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    Router.push('/login');
    window.location.reload(); // Refresh the page
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>Welcome, {user.Name}</h1>
      <div className={styles.infoContainer}>
        <div className={styles.visitBox}>
          <p>You visited WebDevsNest</p>
          <h2>{streakData?.streak || 0}</h2>
          <p>Days in a row!</p>
        </div>
        <div className={styles.favoritesBox}>
          <h2>Your Favorite Posts</h2>
          <div className={styles.favoritesList}>
            {favoritesData?.favorites && favoritesData.favorites.length > 0 ? (
              favoritesData.favorites.map((post) => (
                <Link key={post.Id} href={`/${post.Category}/${post.Slug}`}>
                  <div className={styles.favoriteItem}>
                    <h3>{post.Title}</h3>
                    <p>{post.Category}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>You have no favorite posts at the moment</p>
            )}
          </div>
        </div>
      </div>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
