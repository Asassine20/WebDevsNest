import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { IoIosSearch } from 'react-icons/io';
import Link from 'next/link';
import styles from './SearchBar.module.css';
import Image from 'next/image';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const searchBarRef = useRef(null);

  const excludedRoutes = ['/signup', '/login'];

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

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        if (error.status === 401) {
          setIsLoggedIn(false);
        } else {
          console.error('An error occurred while checking login status:', error);
        }
      }
    };
    checkLoggedInStatus();
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

  const handleProfileIconClick = () => {
    if (isLoggedIn) {
      router.push('/profile/dashboard');
    }
  };

  if (excludedRoutes.includes(router.pathname)) {
    return null;
  }

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src={require('../../public/logo.png')} alt="Logo" height="50" />
        </Link>
      </div>
      <div className={styles.searchContainer} ref={searchBarRef}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search posts..."
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
      <div className={styles.authButtons}>
        {isLoggedIn ? (
          <FaUserCircle
            className={styles.profileIcon}
            onClick={handleProfileIconClick}
          />
        ) : (
          <Link href="/login">
            <span className={`${styles.authButton} ${styles.noUnderline}`}>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
