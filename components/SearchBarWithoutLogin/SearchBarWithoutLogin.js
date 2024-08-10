import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { IoIosSearch } from 'react-icons/io';
import styles from './SearchBar.module.css';

const SearchBarWithoutLogin = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchBarRef = useRef(null);

  useEffect(() => {
    if (query.length > 1) {
      fetch(`/api/search?query=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
          setShowSuggestions(true);
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      const topSuggestion = suggestions[0];
      router.push(`/${topSuggestion.Category}/${topSuggestion.Slug}`);
      setShowSuggestions(false);
    }
  };

  const handleItemClick = (category, slug) => {
    router.push(`/${category}/${slug}`);
    setShowSuggestions(false);
  };

  const handleIconClick = () => {
    if (suggestions.length > 0) {
      const topSuggestion = suggestions[0];
      router.push(`/${topSuggestion.Category}/${topSuggestion.Slug}`);
      setShowSuggestions(false);
    }
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

  const handleFocus = () => {
    if (query.length > 1) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={styles.searchContainer} ref={searchBarRef}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Learn a new programming language"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className={styles.searchInput}
        />
        <IoIosSearch className={styles.searchIcon} onClick={handleIconClick} />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((post) => (
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

export default SearchBarWithoutLogin;
