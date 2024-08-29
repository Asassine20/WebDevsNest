import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';  // Adjust the import path to match your directory structure
import styles from '../../styles/Portfolio.module.css';

export default function Portfolio() {
  const router = useRouter();
  const { portfolioSlug } = router.query;

  // Fetch the portfolio data based on the slug
  const { data, error } = useSWR(portfolioSlug ? `/api/portfolio?portfolioSlug=${portfolioSlug}` : null, fetcher);

  if (error) return <div>Error loading portfolio</div>;
  if (!data) return <div>Loading...</div>;

  const portfolio = data.portfolio;

  return (
    <div className={styles.portfolioContainer}>
      <h1>{portfolio.Name}</h1>
      <p>{portfolio.Content}</p>
      {portfolio.ResumeFile && (
        <a href={portfolio.ResumeFile} download>
          Download Resume
        </a>
      )}
      {/* Display other portfolio details here */}
    </div>
  );
}
