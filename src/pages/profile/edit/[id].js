import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../styles/Dashboard.module.css';
import dynamic from 'next/dynamic';
import * as Showdown from 'showdown';
import 'easymde/dist/easymde.min.css';

// Dynamically import SimpleMDE
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const EditPortfolioItem = () => {
  const [portfolioItem, setPortfolioItem] = useState({ title: '', description: '', category: '', content: '' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/portfolio?id=${id}`)
        .then(res => res.json())
        .then(data => {
          setPortfolioItem(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch('/api/portfolio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...portfolioItem, id }),
    });

    router.push('/dashboard');
  };

  const handleDelete = async () => {
    await fetch('/api/portfolio', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    router.push('/dashboard');
  };

  const handleChange = (value, field) => {
    setPortfolioItem(prevItem => ({
      ...prevItem,
      [field]: value,
    }));
  };

  const handleContentChange = useCallback((value) => {
    setPortfolioItem(prevItem => ({
      ...prevItem,
      content: value,
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

  return (
    <div className={styles.container}>
      <h1>Edit Portfolio Item</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={portfolioItem.title}
          onChange={(e) => handleChange(e.target.value, 'title')}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Category"
          value={portfolioItem.category}
          onChange={(e) => handleChange(e.target.value, 'category')}
          className={styles.input}
        />
        <textarea
          placeholder="Short Description"
          value={portfolioItem.description}
          onChange={(e) => handleChange(e.target.value, 'description')}
          className={styles.input}
        />
        <SimpleMDE
          value={portfolioItem.content}
          onChange={handleContentChange}
          options={options}
        />
        <button type="submit" className={styles.button}>Update</button>
        <button
          type="button"
          onClick={handleDelete}
          className={`${styles.button} ${styles.deleteButton}`}
        >
          Delete
        </button>
      </form>
    </div>
  );
};

export default EditPortfolioItem;
