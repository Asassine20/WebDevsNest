import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '../../styles/Portfolio.module.css';
import fetcher from '../../../lib/fetcher';
import { useState } from 'react';

export default function Portfolio() {
  const router = useRouter();
  const { portfolioSlug } = router.query;
  const { data, error } = useSWR(portfolioSlug ? `/api/portfolio?portfolioSlug=${portfolioSlug}` : null, fetcher);

  const [currentIndex, setCurrentIndex] = useState(0); // For carousel navigation

  if (error) return <div>Error loading portfolio</div>;
  if (!data || !data.portfolio) return <div>No portfolio found</div>;

  const portfolio = data.portfolio;

  // Ensure that workExperience and projects are valid arrays
  const workExperience = portfolio.WorkExperience ? JSON.parse(portfolio.WorkExperience) : [];
  const projects = portfolio.Projects ? JSON.parse(portfolio.Projects) : [];

  // Use the file path from the database for profile image
  const profileImageSrc = portfolio.ProfileImage ? portfolio.ProfileImage : null;

  // Helper function to format date
  const formatDate = (date) => {
    return date ? date : 'Present'; // Return "Present" if the date is null or undefined
  };

  // Define carousel sections
  const sections = [
    {
      title: `${portfolio.Name}`,
      content: (
        <>
          <p>University: {portfolio.University}</p>
          {portfolio.ResumeFile && (
            <a href={portfolio.ResumeFile} download className={styles.resumeLink}>
              Download Resume
            </a>
          )}
          {profileImageSrc && <img src={profileImageSrc} alt="Profile" className={styles.imagePreview} />}
        </>
      ),
    },
    {
      title: 'Work Experience',
      content: workExperience.length > 0 ? (
        workExperience.map((experience, index) => {
          const startDate = experience.startDate ? experience.startDate : 'Unknown Start Date';
          const endDate = experience.endDate ? experience.endDate : 'Present';

          return (
            <div key={index} className={styles.workExperience}>
              <p>Company: {experience.company}</p>
              <p>Role: {experience.role}</p>
              <p>Duration: {startDate} - {endDate}</p>
              <p>Description: {experience.description}</p>
            </div>
          );
        })
      ) : (
        <p>No work experience added.</p>
      ),
    },
    {
      title: 'Projects',
      content: projects.length > 0 ? (
        projects.map((project, index) => (
          <div key={index} className={styles.project}>
            <p>Project Name: {project.name}</p>
            <p>Tech Stack: {project.techStack}</p>
            <a href={project.demoLink} className={styles.portfolioLink}>
              Demo Link
            </a>
            <p>Description: {project.description}</p>
          </div>
        ))
      ) : (
        <p>No projects added.</p>
      ),
    },
  ];

  // Helper functions for carousel navigation
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sections.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sections.length) % sections.length);
  };

  // Get the titles for the next and previous sections
  const nextTitle = sections[(currentIndex + 1) % sections.length].title;
  const prevTitle = sections[(currentIndex - 1 + sections.length) % sections.length].title;

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.navContainer}>
        <p className={styles.navTitle}>{prevTitle}</p>
        <button onClick={handlePrev} className={styles.navButton}>&#8592;</button>
      </div>

      <div className={styles.carouselItem}>
        <h1>{sections[currentIndex].title}</h1>
        <div>{sections[currentIndex].content}</div>
      </div>

      <div className={styles.navContainer}>
        <p className={styles.navTitle}>{nextTitle}</p>
        <button onClick={handleNext} className={styles.navButton}>&#8594;</button>
      </div>
    </div>
  );
}
