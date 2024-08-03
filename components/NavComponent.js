import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { RxHamburgerMenu } from 'react-icons/rx';
import styles from './NavComponent.module.css';
import categoryLinks from '../links'; // Adjust the path as needed

const NavComponent = ({ category, slug, isSlugPage }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navRef = useRef(null);
  const sidePanelRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1067);
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
  }, [isPanelOpen]);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  const relevantLinks = categoryLinks[category] || {};

  return (
    <div>
      <div ref={navRef} className={styles.navContainer}>
        {isSlugPage && isSmallScreen && (
          <button onClick={togglePanel} className={styles.toggleButton}>
            <RxHamburgerMenu size={24} />
          </button>
        )}
        <div className={styles.linksContainer}>
          {Object.keys(categoryLinks).map((category, idx) => (
            <Link href={`/${category}`} key={idx} className={styles.categoryLink}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          ))}
        </div>
      </div>
      {isPanelOpen && (
        <div ref={sidePanelRef} className={styles.sidePanel}>
          <button onClick={closePanel} className={styles.closeButton}>×</button>
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          {Object.keys(relevantLinks).map((miniTitle, index) => (
            <div key={index}>
              <h3>{miniTitle.charAt(0).toUpperCase() + miniTitle.slice(1)}</h3>
              <ul>
                {relevantLinks[miniTitle].map((link, idx) => (
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
