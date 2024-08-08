import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import withAdminAuth from '../../../components/WithAdminAuth';
import styles from '../../styles/Admin.module.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as Showdown from 'showdown';
import 'easymde/dist/easymde.min.css';

// Dynamically import SimpleMDE
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, category }),
    });
    router.push('/admin');
  };

  const handleContentChange = useCallback((value) => {
    setContent(value);
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">
          <img src="/logo.png" alt="Logo" className={styles.logo} />
        </Link>
        <h1 className={styles.title}>Create New Post</h1>
      </header>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.input}
        />
        <SimpleMDE
          value={content}
          onChange={handleContentChange}
          options={options}
        />
        <div className={styles.preview}>
          <h3>Preview</h3>
          <div
            dangerouslySetInnerHTML={{ __html: converter.makeHtml(content) }}
          />
        </div>
        <button type="submit" className={styles.button}>Create</button>
      </form>
    </div>
  );
};

export default withAdminAuth(NewPost);
