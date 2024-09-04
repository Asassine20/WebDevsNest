import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher'; 
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

  // Combine all content into a single section
  const renderContent = () => {
    return contentSections.map((section, index) => {
      switch (section.type) {
        case 'title':
          return <h2 key={index}>{section.content}</h2>;
        case 'text':
          return <p key={index}>{section.content}</p>;
        case 'image':
          return (
            <div key={index} className={styles.imagePreview}>
              <img src={section.content} alt="Portfolio Image" />
            </div>
          );
        case 'link':
          return (
            <a
              key={index}
              href={section.content}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.portfolioLink}
            >
              View Demo
            </a>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{portfolio.Name}</h1>

      {/* Display Resume right after the portfolio name */}
      {portfolio.ResumeFile && (
        <a href={portfolio.ResumeFile} download className={styles.resumeLink}>
          Download Resume
        </a>
      )}

      {/* Render all content in one section */}
      <div className={styles.contentSection}>
        {renderContent()}
      </div>
    </div>
  );
}
