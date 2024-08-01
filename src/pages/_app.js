import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import SearchBar from '../../components/SearchBar/SearchBar';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      const { auth } = nookies.get();

      if (!auth && !['/login', '/signup'].includes(url)) {
        router.push('/login');
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <SearchBar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
