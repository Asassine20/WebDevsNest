import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import withAdminAuth from '../../../../components/WithAdminAuth';
import styles from '../../../styles/Admin.module.css';
import Link from 'next/link'

const EditPost = () => {
  const [post, setPost] = useState({ title: '', content: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/posts?id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setPost({
              title: data[0].Title || '',
              content: data[0].Content || '',
              category: data[0].Category || ''
            });
          } else {
            setError('Post not found');
          }
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load post data.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...post, id }),
    });
    router.push('/admin');
  };

  const handleDelete = async () => {
    await fetch('/api/posts', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    router.push('/admin');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prevPost => ({
      ...prevPost,
      [name]: value
    }));
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">
          <img src="/logo.png" alt="Logo" className={styles.logo} />
        </Link>
        <h1 className={styles.title}>Edit Post</h1>
      </header>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h4>Title</h4>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={post.title}
          onChange={handleChange}
          className={styles.input}
        />
        <h4>Category</h4>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={post.category}
          onChange={handleChange}
          className={styles.input}
        />
        <h4>Content</h4>
        <textarea
          name="content"
          placeholder="Content"
          value={post.content}
          onChange={handleChange}
          className={styles.textarea}
        />
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>Update</button>
          <button
            type="button"
            onClick={handleDelete}
            className={`${styles.button} ${styles.deleteButton}`}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAdminAuth(EditPost);
