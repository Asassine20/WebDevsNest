import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import Link from 'next/link';
import fetcher from '../../../lib/fetcher';
import styles from '../../styles/Dashboard.module.css';

export default function Dashboard() {
  const { data: user, error: userError } = useSWR('/api/auth/user', fetcher);
  const { data: streakData, error: streakError } = useSWR(user ? `/api/visit?userId=${user?.Id}` : null, fetcher);
  const { data: favoritesData, error: favoritesError } = useSWR(user ? `/api/userFavorites?userId=${user?.Id}` : null, fetcher);
  const { data: portfolioData, error: portfolioError, mutate } = useSWR(user ? `/api/portfolio?userId=${user?.Id}` : null, fetcher);

  useEffect(() => {
    if (userError) {
      Router.push('/login');
    }
  }, [userError]);

  if (!user && !userError) return <div>Loading...</div>;
  if (userError) return <div>Error loading user data</div>;
  if (streakError) return <div>Error loading streak data</div>;
  if (favoritesError) return <div>Error loading favorites data</div>;
  if (portfolioError) {
    if (portfolioError.status === 404) {
      // Handle case where no portfolios exist for this user
      return <div>No portfolios found for this user.</div>;
    }
    return <div>Error loading portfolio data</div>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    Router.push('/login');
    window.location.reload(); // Refresh the page
  };

  const handleDelete = async (portfolioId) => {
    const confirmed = window.confirm('Are you sure you want to delete this portfolio?');
    if (confirmed) {
      const response = await fetch(`/api/portfolio?id=${portfolioId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Portfolio deleted successfully');
        mutate(); // Re-fetch portfolio data after deletion
      } else {
        alert('Failed to delete portfolio');
      }
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>Welcome, {user?.Name}</h1>
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
        <div className={styles.portfolioBox}>
          <h2>Your Portfolio</h2>
          <div className={styles.portfolioList}>
            {portfolioData?.projects && portfolioData.projects.length > 0 ? (
              portfolioData.projects.map((project) => (
                <div key={project.Id} className={styles.portfolioItem}>
                  <h3>{project.Name}</h3>
                  <p>{project.description}</p>
                  <Link href={`/profile/edit/${project.Id}`}>
                    Edit Portfolio
                  </Link>
                  <Link href={`/${project.PortfolioSlug}`}>
                    View Portfolio
                  </Link>
                  <button 
                    onClick={() => handleDelete(project.Id)} 
                    className={styles.deleteButton}>
                    Delete Portfolio
                  </button>
                </div>
              ))
            ) : (
              <p>You have no portfolio items at the moment</p>
            )}
          </div>
          <Link href="/profile/new">
            <button className={styles.addPortfolioButton}>
              Add New Portfolio Item
            </button>
          </Link>
        </div>
      </div>
      {user?.Role === 'admin' && (
        <Link href="/admin">
          <button className={styles.adminButton}>
            Admin Dashboard
          </button>
        </Link>
      )}
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
