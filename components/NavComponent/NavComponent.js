import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RxHamburgerMenu } from 'react-icons/rx';
import styles from './NavComponent.module.css';
import categoryLinks from '../../links'; // Maintain the use of links.js

const NavComponent = ({ category, slug, isSlugPage, onSidePanelToggle }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [groupedLinks, setGroupedLinks] = useState({});
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

      console.log('Grouped Data:', groupedData); // Debug log to check the grouped data
      setGroupedLinks(groupedData);
    } else {
      console.log('No posts found for category:', category);
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

  return (
    <div>
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
                      <Link href={`/${link.Category}/${link.Slug}`}>{link.Title}</Link>
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

export default NavComponent;
