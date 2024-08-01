import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './SearchBar.module.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 1) {
      fetch(`/api/search?query=${query}`)
        .then(res => res.json())
        .then(data => setSuggestions(data));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      const topSuggestion = suggestions[0];
      router.push(`/${topSuggestion.Category}/${topSuggestion.Slug}`);
    }
  };

  const handleItemClick = (category, slug) => {
    router.push(`/${category}/${slug}`);
  };

  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className={styles.highlight}>{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={styles.searchInput}
      />
      {suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((post, index) => (
            <li
              key={post.Id}
              className={styles.suggestionItem}
              onClick={() => handleItemClick(post.Category, post.Slug)}
            >
              {highlightText(post.Title, query)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
