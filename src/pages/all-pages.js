import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/PostsPage.module.css';

export default function AllPostsPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 50;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/allPosts');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Calculate paginated posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Pagination Handlers
  const handleNextPage = () => {
    if (currentPage < Math.ceil(posts.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>All Posts</h1>
      <ul className={styles.postsList}>
        {currentPosts.map((post) => (
          <li key={post.id} className={styles.postItem}>
            <Link href={post.url}>
              <button className={styles.postButton}>
                <strong>{post.title}</strong>
                <br />
                <span><strong>Category:</strong> {post.category}</span>
                <br />
                <span className={styles.description}><strong>Description:</strong> {post.metaDescription}</span>
              </button>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(posts.length / postsPerPage)}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(posts.length / postsPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
}
