// pages/[...slug].js
import { createConnection } from '../../lib/db';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import Head from 'next/head';

// Function to generate a slug from a title
const generateSlug = (title) => {
  if (!title) return '';
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export async function getStaticPaths() {
  const connection = await createConnection();
  const [rows] = await connection.execute('SELECT Category, Slug FROM Posts');
  await connection.end();

  const paths = rows.map(post => ({
    params: { slug: [post.Category, post.Slug] },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const category = params.slug[0];
  const slug = params.slug[1];

  const connection = await createConnection();
  const [rows] = await connection.execute('SELECT * FROM Posts WHERE Category = ? AND Slug = ?', [category, slug]);
  await connection.end();

  if (rows.length === 0) {
    return { notFound: true };
  }

  const post = rows[0];
  const data = {
    title: post.Title,
    description: post.Content,
    date: post.Created_at.toISOString(), // Convert date to ISO string
  };
  const content = post.Content;

  return { props: { data, content } };
}

const Post = ({ data, content }) => {
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
      <MarkdownRenderer content={content} />
    </>
  );
};

export default Post;
