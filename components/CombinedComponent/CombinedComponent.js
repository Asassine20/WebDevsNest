import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaUserCircle } from "react-icons/fa";
import { IoIosSearch } from 'react-icons/io';
import styles from './CombinedComponent.module.css';
import categoryLinks from '../../links';
import Image from 'next/image';

const CombinedComponent = ({ category, slug, isSlugPage, onSidePanelToggle }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [groupedLinks, setGroupedLinks] = useState({});
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navRef = useRef(null);
  const searchBarRef = useRef(null);
  const sidePanelRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth <= 1067;
      setIsSmallScreen(smallScreen);

      if (!smallScreen && isPanelOpen) {
        setIsPanelOpen(false);
        onSidePanelToggle(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isPanelOpen, onSidePanelToggle]);

  useEffect(() => {
    if (isPanelOpen || !isSmallScreen) {
      loadPanelData();
    }
  }, [isPanelOpen, isSmallScreen]);

  const loadPanelData = async () => {
    const res = await fetch(`/api/postData?category=${category}`);
    const posts = await res.json();

    if (posts && posts.length > 0) {
      const groupedData = posts.reduce((acc, post) => {
        const subCategory = post.SubCategory || 'General';
        if (!acc[subCategory]) {
          acc[subCategory] = [];
        }
        acc[subCategory].push(post);
        return acc;
      }, {});

      setGroupedLinks(groupedData);
    } else {
      setGroupedLinks({});
    }
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
    onSidePanelToggle(!isPanelOpen);

    if (!isPanelOpen) {
      loadPanelData();
    }
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    onSidePanelToggle(false);
  };

  const handleLinkClick = () => {
    closePanel(); // Close the panel when a link is clicked
  };

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

  const handleProfileIconClick = () => {
    if (isLoggedIn) {
      router.push('/profile/dashboard');
    }
  };

  return (
    <div className={styles.contentWrapper}>
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
              onFocus={() => setShowSuggestions(true)}
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
      <div ref={navRef} className={styles.navContainer}>
        {isSlugPage && isSmallScreen && (
          <button onClick={togglePanel} className={styles.toggleButton}>
            <RxHamburgerMenu size={24} />
          </button>
        )}
        <div className={styles.linksContainer}>
          {Object.keys(categoryLinks).map((category, idx) => {
            const isActive = router.asPath === categoryLinks[category].defaultUrl;
            return (
              <Link href={categoryLinks[category].defaultUrl} key={idx} className={`${styles.categoryLink} ${isActive ? styles.activeLink : ''}`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            );
          })}
        </div>
      </div>
      {isPanelOpen && (
        <div ref={sidePanelRef} className={styles.sidePanel}>
          <button onClick={closePanel} className={styles.closeButton}>×</button>
          {Object.keys(groupedLinks).length > 0 ? (
            Object.keys(groupedLinks).map((subCategory, index) => (
              <div key={index}>
                <h3>{subCategory.charAt(0).toUpperCase() + subCategory.slice(1)}</h3>
                <ul>
                  {groupedLinks[subCategory].map((link, idx) => (
                    <li key={idx} className={link.Slug === slug ? styles.activeLink : ''}>
                      <Link href={`/${link.Category}/${link.Slug}`} onClick={handleLinkClick}>{link.Title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No posts available in this category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CombinedComponent;
