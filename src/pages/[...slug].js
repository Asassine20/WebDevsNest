// pages/[...slug].js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import Head from 'next/head';

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'posts');

  function getPaths(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries
      .filter(file => !file.isDirectory())
      .map(file => path.relative(postsDirectory, path.join(dir, file.name)));  // Use file.name
    const directories = entries.filter(folder => folder.isDirectory());
    for (const directory of directories) {
      files.push(...getPaths(path.join(dir, directory.name)));
    }
    return files;
  }

  const files = getPaths(postsDirectory);

  const paths = files.map((file) => {
    const slug = file.replace(/\.md$/, '').split(path.sep);
    return {
      params: { slug },
    };
  });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'posts', ...params.slug) + '.md';
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

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
