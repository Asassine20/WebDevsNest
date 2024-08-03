import { useState, useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import styles from './CategoryNav.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import categoryLinks from '../../links'; // Adjust the path as needed

const CategoryNav = ({ onToggleSidePanel }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const router = useRouter();

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
    if (onToggleSidePanel) {
      onToggleSidePanel();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1067);
    };

    handleResize(); // Check the screen size on initial render
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      setSidePanelOpen(false); // Close side panel by default on small screens
    }
  }, [isSmallScreen]);

  return (
    <div className={styles.categoryNavContainer}>
      {isSmallScreen && router.pathname !== '/' && (
        <button className={styles.toggleButton} onClick={toggleSidePanel}>
          <RxHamburgerMenu size={24} />
        </button>
      )}
      <div className={`${styles.categoryList} ${sidePanelOpen ? styles.open : ''}`}>
        {Object.keys(categoryLinks).map((category, index) => (
          <Link key={index} href={`/${category}`} passHref legacyBehavior>
            <a className={styles.categoryLink}>{category.charAt(0).toUpperCase() + category.slice(1)}</a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
