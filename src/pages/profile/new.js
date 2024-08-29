import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '../../styles/Dashboard.module.css';
import dynamic from 'next/dynamic';
import * as Showdown from 'showdown';
import 'easymde/dist/easymde.min.css';
import fetcher from '../../../lib/fetcher';

// Dynamically import SimpleMDE
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const NewPortfolioItem = () => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [resume, setResume] = useState(null);
  const router = useRouter();

  // Fetch the user data to get the userId
  const { data: user, error: userError } = useSWR('/api/auth/user', fetcher);

  useEffect(() => {
    if (userError) {
      console.error('Error fetching user data:', userError);
    }
  }, [userError]);

  const handleContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResume(reader.result.split(',')[1]); // Get the base64 content
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error('User not found');
      return;
    }

    const userId = user.Id;

    const response = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content, userId, resume }),
    });

    if (response.ok) {
      console.log('Portfolio created successfully');
      router.push('/profile/dashboard');
    } else {
      console.error('Failed to create portfolio');
    }
  };

  const converter = useMemo(
    () =>
      new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
      }),
    []
  );

  const options = useMemo(
    () => ({
      spellChecker: false,
      showIcons: ['code', 'table'],
    }),
    []
  );

  return (
    <div className={styles.container}>
      <h1>Create New Portfolio Item</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <SimpleMDE value={content} onChange={handleContentChange} options={options} />
        <input type="file" accept=".pdf" onChange={handleResumeChange} className={styles.input} />
        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </div>
  );
};

export default NewPortfolioItem;
