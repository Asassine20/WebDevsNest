import '../styles/globals.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import NavComponent from '../../components/NavComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../../lib/gtag';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugPage, setIsSlugPage] = useState(false);

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
      const pathSegments = url.split('/');
      if (pathSegments.length >= 3) {
        setCategory(pathSegments[1]);
        setSlug(pathSegments[2]);
        setIsSlugPage(true);
      } else {
        setCategory('');
        setSlug('');
        setIsSlugPage(false);
      }
    };

    // Set initial value
    handleRouteChange(router.asPath);

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const handleSidePanelToggle = (isOpen) => {
    // Pass this function to the NavComponent to handle side panel state
  };

  return (
    <>
      <SearchBar />
      <NavComponent category={category} slug={slug} isSlugPage={isSlugPage} onSidePanelToggle={handleSidePanelToggle} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
