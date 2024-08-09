import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import withAdminAuth from '../../../../components/WithAdminAuth';
import styles from '../../../styles/Admin.module.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as Showdown from 'showdown';
import 'easymde/dist/easymde.min.css';

// Dynamically import SimpleMDE
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const EditPost = () => {
  const [post, setPost] = useState({ title: '', content: '', category: '', subCategory: '' }); // Add subCategory field
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
              category: data[0].Category || '',
              subCategory: data[0].SubCategory || '', // Include subCategory
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

  const handleChange = (value, field) => {
    setPost(prevPost => ({
      ...prevPost,
      [field]: value
    }));
  };

  const handleContentChange = useCallback((value) => {
    setPost(prevPost => ({
      ...prevPost,
      content: value
    }));
  }, []);

  const converter = useMemo(() => new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  }), []);

  const options = useMemo(() => ({
    spellChecker: false,
    showIcons: ["code", "table"],
  }), []);

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
          onChange={(e) => handleChange(e.target.value, 'title')}
          className={styles.input}
        />
        <h4>Category</h4>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={post.category}
          onChange={(e) => handleChange(e.target.value, 'category')}
          className={styles.input}
        />
        <h4>SubCategory</h4> {/* Add SubCategory input */}
        <input
          type="text"
          name="subCategory"
          placeholder="SubCategory"
          value={post.subCategory}
          onChange={(e) => handleChange(e.target.value, 'subCategory')}
          className={styles.input}
        />
        <h4>Content</h4>
        <SimpleMDE
          value={post.content}
          onChange={handleContentChange}
          options={options}
        />
        <div className={styles.preview}>
          <h3>Preview</h3>
          <div
            dangerouslySetInnerHTML={{ __html: converter.makeHtml(post.content) }}
          />
        </div>
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
