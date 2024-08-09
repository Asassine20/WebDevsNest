import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RxHamburgerMenu } from 'react-icons/rx';
import styles from './NavComponent.module.css';
import categoryLinks from '../../links'; // Maintain the use of links.js

const NavComponent = ({ category, slug, isSlugPage, onSidePanelToggle }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navRef = useRef(null);
  const sidePanelRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth <= 1067;
      setIsSmallScreen(smallScreen);

      if (!smallScreen && isPanelOpen) {
        setIsPanelOpen(false);
        onSidePanelToggle(false); // Notify parent to close slug side panel
      }
    };

    const handleScroll = () => {
      if (isPanelOpen && sidePanelRef.current) {
        const sidePanel = sidePanelRef.current;
        const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
        sidePanel.style.top = `${navHeight}px`;

        const { top, bottom } = sidePanel.getBoundingClientRect();
        if (window.scrollY < top || window.scrollY > bottom) {
          setIsPanelOpen(false);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPanelOpen, onSidePanelToggle]);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
    onSidePanelToggle(!isPanelOpen);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    onSidePanelToggle(false);
  };

  const relevantLinks = categoryLinks[category] || {};
  const linkSections = Object.keys(relevantLinks).filter(key => Array.isArray(relevantLinks[key]));

  // Group links by SubCategory
  const groupedLinks = linkSections.reduce((acc, section) => {
    const sectionLinks = relevantLinks[section];
    acc[section] = sectionLinks;
    return acc;
  }, {});

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
          {Object.keys(groupedLinks).map((subCategory, index) => (
            <div key={index}>
              <h3>{subCategory.charAt(0).toUpperCase() + subCategory.slice(1)}</h3>
              <ul>
                {groupedLinks[subCategory].map((link, idx) => (
                  <li key={idx} className={link.url === `/${category}/${slug}` ? styles.activeLink : ''}>
                    <Link href={link.url}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavComponent;
