import '../styles/globals.css';
import CombinedComponent from '../../components/CombinedComponent/CombinedComponent';
import Footer from '../../components/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from '../../lib/fetcher';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from '@next/third-parties/google';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugPage, setIsSlugPage] = useState(false);
  const { data: user } = useSWR('/api/auth/user', fetcher);

  useEffect(() => {
    const handleRouteChange = (url) => {
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

    handleRouteChange(router.asPath); // Handle the initial page load

    router.events.on('routeChangeComplete', handleRouteChange); // Handle subsequent route changes
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, user]);

  const handleSidePanelToggle = (isOpen) => {
    // Handle side panel state
  };

  const adminRoutes = ['/admin', '/admin/new', '/admin/edit/[id]'];
  const isAdminRoute = adminRoutes.some(route => router.pathname.startsWith(route));

  const shouldShowNav = !['/login', '/signup'].includes(router.pathname) && !isAdminRoute;
  const shouldShowFooter = shouldShowNav;

  return (
    <>
      {shouldShowNav && (
        <CombinedComponent
          category={category}
          slug={slug}
          isSlugPage={isSlugPage}
          onSidePanelToggle={handleSidePanelToggle}
        />
      )}
      <Component {...pageProps} />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      {shouldShowFooter && <Footer />}
      <SpeedInsights />
    </>
  );
}

export default MyApp;
