import { useEffect, useState } from 'react';
import Link from 'next/link';
import withAdminAuth from '../../../components/WithAdminAuth';
import styles from '../../styles/Admin.module.css';

const Admin = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  // Group posts by Category and then by SubCategory
  const categorizedPosts = posts.reduce((acc, post) => {
    if (!acc[post.Category]) {
      acc[post.Category] = {};
    }
    if (!acc[post.Category][post.SubCategory]) {
      acc[post.Category][post.SubCategory] = [];
    }
    acc[post.Category][post.SubCategory].push(post);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">
          <img src="/logo.png" alt="Logo" className={styles.logo} />
        </Link>
        <h1 className={styles.title}>Admin Dashboard</h1>
      </header>
      <Link href="/admin/new" className={styles.createNewLink}>Create New Post</Link>
      <div className={styles.categories}>
        {Object.keys(categorizedPosts).map(category => (
          <div key={category} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            {Object.keys(categorizedPosts[category]).map(subCategory => (
              <div key={subCategory} className={styles.subCategory}>
                <h3 className={styles.subCategoryTitle}>{subCategory}</h3>
                <ul className={styles.postList}>
                  {categorizedPosts[category][subCategory].map(post => (
                    <li key={post.Id} className={styles.postItem}>
                      <div>
                        <a
                          href={`/${post.Category}/${post.Slug}`} // Link to the actual post
                          target="_blank" // Open in a new tab
                          rel="noopener noreferrer" // For security
                          className={styles.postLink}
                        >
                          {post.Title}
                        </a>
                        <span className={styles.postDate}>
                          {new Date(post.CreatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={styles.postLinkSuffix}>
                        <Link href={`/admin/edit/${post.Id}`}>Edit</Link>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAdminAuth(Admin);
