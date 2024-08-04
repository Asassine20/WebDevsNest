import '../styles/globals.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import NavComponent from '../../components/NavComponent/NavComponent';
import Footer from '../../components/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../../lib/gtag';
import useSWR from 'swr';
import fetcher from '../../lib/fetcher';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugPage, setIsSlugPage] = useState(false);
  const { data: user } = useSWR('/api/auth/user', fetcher);

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

      if (user) {
        fetch('/api/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.Id }),
        });
      }
    };

    // Set initial value
    handleRouteChange(router.asPath);

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, user]);

  const handleSidePanelToggle = (isOpen) => {
    // Pass this function to the NavComponent to handle side panel state
  };

  const shouldShowFooter = !['/login', '/signup'].includes(router.pathname);

  return (
    <>
      <SearchBar />
      <NavComponent category={category} slug={slug} isSlugPage={isSlugPage} onSidePanelToggle={handleSidePanelToggle} />
      <Component {...pageProps} />
      {shouldShowFooter && <Footer />}
    </>
  );
}

export default MyApp;
