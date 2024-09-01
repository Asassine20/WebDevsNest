import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher'; // Adjust the import path to match your directory structure
import styles from '../../styles/Portfolio.module.css';

export default function Portfolio() {
  const router = useRouter();
  const { portfolioSlug } = router.query;

  // Fetch the portfolio data based on the slug
  const { data, error } = useSWR(portfolioSlug ? `/api/portfolio?portfolioSlug=${portfolioSlug}` : null, fetcher);

  if (error) return <div>Error loading portfolio</div>;
  if (!data) return <div>Loading...</div>;

  const portfolio = data.portfolio;
  const contentSections = JSON.parse(portfolio.Content); // Parse the JSON string into an array

  return (
    <div className={styles.portfolioContainer}>
      <h1>{portfolio.Name}</h1>
      {contentSections.map((section, index) => (
        <div key={index} className={styles.portfolioSection}>
          {section.type === 'title' && <h2>{section.content}</h2>}
          {section.type === 'text' && <p>{section.content}</p>}
          {section.type === 'image' && <img src={section.content} alt="Portfolio Image" className={styles.portfolioImage} />}
          {section.type === 'link' && (
            <a href={section.content} target="_blank" rel="noopener noreferrer" className={styles.portfolioLink}>
              View Demo
            </a>
          )}
        </div>
      ))}
      {portfolio.ResumeFile && (
        <a href={portfolio.ResumeFile} download>
          Download Resume
        </a>
      )}
    </div>
  );
}
