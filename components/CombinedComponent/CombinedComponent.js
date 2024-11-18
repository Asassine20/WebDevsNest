import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaUserCircle } from 'react-icons/fa';
import { MdArrowForwardIos } from 'react-icons/md'; // Import right arrow icon
import Image from 'next/image';
import SearchBar from '../SearchBar/SearchBar';
import styles from './CombinedComponent.module.css';
import categoryLinks from '../../links';

const CombinedComponent = ({ category, slug, isSlugPage, onSidePanelToggle }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [groupedLinks, setGroupedLinks] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showArrow, setShowArrow] = useState(true); // State to control arrow visibility
  const navRef = useRef(null);
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
    closePanel();
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

  // Drag scrolling logic
  useEffect(() => {
    const navContainer = navRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      navContainer.classList.add(styles.active);
      startX = e.pageX - navContainer.offsetLeft;
      scrollLeft = navContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      navContainer.classList.remove(styles.active);
    };

    const handleMouseUp = () => {
      isDown = false;
      navContainer.classList.remove(styles.active);
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - navContainer.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      navContainer.scrollLeft = scrollLeft - walk;
    };

    // Hide arrow when user scrolls
    const handleScroll = () => {
      setShowArrow(navContainer.scrollLeft === 0);
    };

    navContainer.addEventListener('mousedown', handleMouseDown);
    navContainer.addEventListener('mouseleave', handleMouseLeave);
    navContainer.addEventListener('mouseup', handleMouseUp);
    navContainer.addEventListener('mousemove', handleMouseMove);
    navContainer.addEventListener('scroll', handleScroll);

    return () => {
      navContainer.removeEventListener('mousedown', handleMouseDown);
      navContainer.removeEventListener('mouseleave', handleMouseLeave);
      navContainer.removeEventListener('mouseup', handleMouseUp);
      navContainer.removeEventListener('mousemove', handleMouseMove);
      navContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.navbarContainer}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src={require('../../public/logo.png')} alt="Logo" height="50" />
          </Link>
        </div>
        <Link href="/all-pages" className={styles.categoryButton}>
          Posts
        </Link>

        <SearchBar placeholder="Search posts..." />
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
              <Link href={categoryLinks[category].defaultUrl} key={idx} className={`${styles.categoryLink} ${isActive ? styles.activeLink : ''}`} draggable="false">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            );
          })}
        </div>
        {isSmallScreen && showArrow && (
          <div className={styles.arrowIcon}>
            <MdArrowForwardIos size={24} />
          </div>
        )}
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
                      <Link href={`/${link.Category}/${link.Slug}`} onClick={handleLinkClick} draggable="false">{link.Title}</Link>
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
