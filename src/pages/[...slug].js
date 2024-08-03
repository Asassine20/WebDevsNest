import { createConnection } from '../../lib/db';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import Head from 'next/head';
import styles from '../styles/Post.module.css';
import Script from 'next/script';
import categoryLinks from '../../links'; // Adjust the path as needed

// Function to generate a slug from a title
const generateSlug = (title) => {
  if (!title) return '';
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export async function getStaticPaths() {
  const connection = await createConnection();
  const [rows] = await connection.execute('SELECT Category, Slug FROM Post');
  await connection.end();

  const paths = rows.map(post => ({
    params: { slug: [post.Category, post.Slug] },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const category = params.slug[0];
  const slug = params.slug[1];

  // Add logging to debug the values
  console.log('Category:', category);
  console.log('Slug:', slug);

  // Check if category and slug are defined
  if (!category || !slug) {
    return { notFound: true };
  }

  const connection = await createConnection();
  const [rows] = await connection.execute('SELECT * FROM Post WHERE Category = ? AND Slug = ?', [category, slug]);
  await connection.end();

  if (rows.length === 0) {
    return { notFound: true };
  }

  const post = rows[0];
  const data = {
    title: post.Title,
    description: post.Content,
    date: post.CreatedAt.toISOString(), // Convert date to ISO string
  };
  const content = post.Content;

  return { props: { data, content, category } };
}

const Post = ({ data, content, category }) => {
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

  // Get relevant links for the current category
  const relevantLinks = categoryLinks[category] || {};

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
        <div className={styles.contentWrapper}>
          <div className={styles.sidePanel}>
            <h2>Related Links</h2>
            {Object.keys(relevantLinks).map((miniTitle, index) => (
              <div key={index}>
                <h3>{miniTitle.charAt(0).toUpperCase() + miniTitle.slice(1)}</h3>
                <ul>
                  {relevantLinks[miniTitle].map((link, idx) => (
                    <li key={idx}>
                      <a href={link.url}>{link.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={styles.mainContent}>
            <div className={styles.ad} style={{ textAlign: 'center' }}>
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '100%', height: '90px' }}
                   data-ad-client="ca-pub-xxxxxxxxxx"
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
          <div className={styles.adSection}>
            <div className={styles.ad}>
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '300px', height: '250px' }}
                   data-ad-client="ca-pub-xxxxxxxxxx"
                   data-ad-slot="xxxxxxxxxx"></ins>
              <Script>
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
              </Script>
            </div>
            <div className={styles.ad}>
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '300px', height: '250px' }}
                   data-ad-client="ca-pub-xxxxxxxxxx"
                   data-ad-slot="xxxxxxxxxx"></ins>
              <Script>
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
              </Script>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
