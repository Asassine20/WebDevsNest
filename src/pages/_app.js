import '../styles/globals.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryNav from '../../components/CategoryNav/CategoryNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../../lib/gtag';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <SearchBar />
      <CategoryNav />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
