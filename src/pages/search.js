import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../components/SearchBar.module.css'; // Reusing the styles for consistency

const Search = () => {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`/api/search?query=${query}`)
        .then(res => res.json())
        .then(data => setResults(data));
    }
  }, [query]);

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <ul className={styles.suggestionsList}>
        {results.map((post) => (
          <li key={post.Id} className={styles.suggestionItem}>
            <Link href={`/posts/${post.Id}`}>
              {post.Title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
