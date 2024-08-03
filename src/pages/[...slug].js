import { useState, useEffect } from 'react';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import Head from 'next/head';
import styles from '../styles/Post.module.css';
import Script from 'next/script';
import categoryLinks from '../../links'; // Adjust the path as needed

export async function getStaticPaths() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseURL}/api/postData`);
  const posts = await res.json();

  const paths = posts.map(post => ({
    params: { slug: [post.Category, post.Slug] },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const category = params.slug[0];
  const slug = params.slug[1];

  // Check if category and slug are defined
  if (!category || !slug) {
    return { notFound: true };
  }

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseURL}/api/postData`);
  
  if (!res.ok) {
    return { notFound: true };
  }

  const posts = await res.json();
  const post = posts.find(post => post.Category === category && post.Slug === slug);

  if (!post) {
    return { notFound: true };
  }

  // Convert CreatedAt to Date object if necessary
  const createdAtDate = new Date(post.CreatedAt);

  // Check if the conversion was successful
  if (isNaN(createdAtDate.getTime())) {
    return { notFound: true }; // If not a valid date, return 404
  }

  const data = {
    title: post.Title,
    description: post.Content,
    date: createdAtDate.toISOString(), // Convert date to ISO string
  };
  const content = post.Content;

  return { props: { data, content, category, slug } };
}

const Post = ({ data, content, category, slug }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1067);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const relevantLinks = categoryLinks[category] || {};

  const linkSections = Object.keys(relevantLinks).filter(key => Array.isArray(relevantLinks[key]));

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
      <div className={styles.pageContainer}>
        {!isSmallScreen && (
          <div className={styles.sidePanel}>
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            {linkSections.map((miniTitle, index) => (
              <div key={index}>
                <h3>{miniTitle.charAt(0).toUpperCase() + miniTitle.slice(1)}</h3>
                <ul>
                  {relevantLinks[miniTitle].map((link, idx) => (
                    <li key={idx} className={link.url === `/${category}/${slug}` ? styles.activeLink : ''}>
                      <a href={link.url}>{link.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
                <h1 className={styles.postTitle}>{data.title}</h1>
                <div className={styles.postMeta}>Published on {new Date(data.date).toLocaleDateString()}</div>
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
