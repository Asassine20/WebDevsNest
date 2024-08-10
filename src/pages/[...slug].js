import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaRegStar } from 'react-icons/fa';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import Head from 'next/head';
import styles from '../styles/Post.module.css';
import Script from 'next/script';
import useSWR from 'swr';
import fetcher from '../../lib/fetcher';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function getStaticPaths() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let paths = [];

  try {
    const res = await fetch(`${baseURL}/api/postData`);
    if (!res.ok) {
      throw new Error(`Failed to fetch paths: ${res.statusText}`);
    }
    const posts = await res.json();
    paths = posts.map(post => ({
      params: { slug: [post.Category, post.Slug] },
    }));
  } catch (error) {
    console.error('Error fetching paths:', error);
  }

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const category = params.slug[0];
  const slug = params.slug[1];

  if (!category || !slug) {
    return { notFound: true };
  }

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let post = null;

  try {
    const res = await fetch(`${baseURL}/api/postData`);
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }
    const posts = await res.json();
    post = posts.find(post => post.Category === category && post.Slug === slug);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  if (!post) {
    return { notFound: true };
  }

  const createdAtDate = new Date(post.CreatedAt);
  if (isNaN(createdAtDate.getTime())) {
    return { notFound: true };
  }

  const data = {
    id: post.Id,
    title: post.Title,
    description: post.Content,
    date: createdAtDate.toISOString(),
  };
  const content = post.Content;

  return {
    props: { data, content, category, slug },
    revalidate: 60, // Revalidate the page at most every 60 seconds
  };
}

const Post = ({ data, content, category, slug }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { data: user } = useSWR('/api/auth/user', fetcher);
  const { data: categoryPosts } = useSWR(`/api/postData?category=${category}`, fetcher);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1067);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const applyOverflowStyles = () => {
      const tables = document.querySelectorAll('table');
      if (tables.length > 0) {
        document.querySelector(`.${styles.postContainer}`).style.overflowX = isSmallScreen ? 'auto' : 'initial';
        document.querySelector(`.${styles.pageContainer}`).style.overflowX = isSmallScreen ? 'auto' : 'initial';
      } else {
        document.querySelector(`.${styles.postContainer}`).style.overflowX = 'initial';
        document.querySelector(`.${styles.pageContainer}`).style.overflowX = 'initial';
      }
    };

    applyOverflowStyles();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSmallScreen]);

  const handleFavoriteClick = async () => {
    if (isLoggedIn) {
      try {
        const res = await fetch('/api/addToFavorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId: data.id }),
        });

        if (res.ok) {
          toast.success('Post added to favorites!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else {
          const errorData = await res.json();
          toast.error('Post already in favorites', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
        toast.error('An error occurred while adding to favorites', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      if (confirm('Log in to access this feature')) {
        router.push('/login');
      }
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "datePublished": data.date,
    "author": {
      "@type": "Person",
      "name": "Andrew Sassine"
    }
  };

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
        <meta name="date" content={data.date} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></Script>
      <ToastContainer />
      <div className={styles.pageContainer}>
        {!isSmallScreen && (
          <div className={styles.sidePanel}>
            {categoryPosts && categoryPosts.length > 0 ? (
              Object.keys(categoryPosts.reduce((acc, post) => {
                acc[post.SubCategory] = acc[post.SubCategory] || [];
                acc[post.SubCategory].push(post);
                return acc;
              }, {})).map((subCategory, index) => (
                <div key={index}>
                  <h3>{subCategory}</h3>
                  <ul>
                    {categoryPosts
                      .filter(post => post.SubCategory === subCategory)
                      .map((post, idx) => (
                        <li key={idx} className={post.Slug === slug ? styles.activeLink : ''}>
                          <a href={`/${post.Category}/${post.Slug}`}>{post.Title}</a>
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
        <div className={styles.mainContentWrapper}>
          <div className={styles.mainContent}>
            <div className={styles.adTop}>
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '100%', height: '60px' }}
                   data-ad-client="ca-pub-6059555296443681"
                   data-ad-slot="xxxxxxxxxx"></ins>
              <Script>
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
              </Script>
            </div>
            <div className={styles.postContainer}>
              <header className={styles.postHeader}>
                <div className={styles.postHeaderContent}>
                  <h1 className={styles.postTitle}>{data.title}</h1>
                  <div className={styles.postMeta}>Published on {new Date(data.date).toLocaleDateString()}</div>
                </div>
                <div className={styles.favoriteIconWrapper}>
                  <FaRegStar
                    className={styles.favoriteIcon}
                    onClick={handleFavoriteClick}
                  />
                  <span className={styles.tooltipText}>Add to Favorites</span>
                </div>
              </header>
              <div className={styles.postContent}>
                <MarkdownRenderer content={content} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.adSection}>
          <div className={styles.adSide}>
            <ins className="adsbygoogle"
                 style={{ display: 'block', width: '160px', height: '600px' }}
                 data-ad-client="ca-pub-6059555296443681"
                 data-ad-slot="xxxxxxxxxx"></ins>
            <Script>
              {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
