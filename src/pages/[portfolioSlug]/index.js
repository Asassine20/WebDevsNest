import { FaGithub, FaLinkedin } from 'react-icons/fa'; 
import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '../../styles/Portfolio.module.css';
import fetcher from '../../../lib/fetcher';
import { useState } from 'react';
import moment from 'moment';

export default function Portfolio() {
  const router = useRouter();
  const { portfolioSlug } = router.query;
  const { data, error } = useSWR(portfolioSlug ? `/api/portfolio?portfolioSlug=${portfolioSlug}` : null, fetcher);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (error) return <div>Error loading portfolio</div>;
  if (!data || !data.portfolio) return <div>No portfolio found</div>;

  const portfolio = data.portfolio;
  console.log('Portfolio:', portfolio);

  // Parsing WorkExperience correctly
  let workExperience = [];
  if (portfolio.WorkExperience) {
    try {
      workExperience = JSON.parse(JSON.parse(portfolio.WorkExperience));
    } catch (e) {
      console.error('Error parsing work experience:', e);
    }
  }

  // Fix for parsing projects
  let projects = [];
  if (portfolio.Projects) {
    try {
      // Double parse to handle the stringified JSON stored in the database
      projects = JSON.parse(JSON.parse(portfolio.Projects));
      console.log('Parsed Projects:', projects); // Console log the parsed projects
    } catch (e) {
      console.error('Error parsing projects:', e);
    }
  }

  const profileImageSrc = portfolio.ProfileImage ? portfolio.ProfileImage : null;

  const formatDate = (date) => {
    if (!date) return null;
    return moment(date, 'YYYY-MM').format('MM/YYYY');
  };

  const calculateDuration = (startDate, endDate) => {
    const start = moment(startDate, 'YYYY-MM');
    const end = endDate ? moment(endDate, 'YYYY-MM') : moment();
    const duration = end.diff(start, 'months');
    return `${duration} months`;
  };

  const sections = [
    {
      title: `${portfolio.Name}`, 
      content: (
        <>
          {profileImageSrc && <img src={profileImageSrc} alt="Profile" className={styles.imagePreview} />}
          {portfolio.ResumeFile && (
            <a href={portfolio.ResumeFile} download className={styles.resumeLink}>
              Download Resume
            </a>
          )}
          <p><span className={styles.boldLabel}>University:</span>{portfolio.University}</p>
          <div className={styles.socialLinks}>
            {portfolio.GithubLink && (
              <a href={portfolio.GithubLink} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                <FaGithub size={30} />
              </a>
            )}
            {portfolio.LinkedinLink && (
              <a href={portfolio.LinkedinLink} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                <FaLinkedin size={30} />
              </a>
            )}
          </div>
        </>
      ),
    },
    {
      title: 'Work Experience',
      content: workExperience.length > 0 ? (
        workExperience.map((experience, index) => {
          const startDate = formatDate(experience.startDate) || 'Unknown Start Date';
          const endDate = formatDate(experience.endDate) || 'Present';
          const durationText = experience.startDate && experience.endDate ? calculateDuration(experience.startDate, experience.endDate) : '';

          return (
            <div key={index} className={styles.workExperience}>
              <p><span className={styles.boldLabel}>Company:</span> {experience.company}</p>
              <p><span className={styles.boldLabel}>Role:</span> {experience.role}</p>
              <p><span className={styles.boldLabel}>Duration:</span> {startDate} - {endDate} {durationText && <span className={styles.durationText}>({durationText})</span>}</p>
              <p><span className={styles.boldLabel}>Description:</span> {experience.description}</p>
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
            <p><span className={styles.boldLabel}>Project Name:</span> {project.name}</p>
            <p><span className={styles.boldLabel}>Tech Stack:</span> {project.techStack}</p>
            <a href={project.demoLink} className={styles.portfolioLink}>
            <span className={styles.boldLabel}>Demo Link</span>
            </a>
            <p><span className={styles.boldLabel}>Description:</span> {project.description}</p>
          </div>
        ))
      ) : (
        <p>No projects added.</p>
      ),
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sections.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sections.length) % sections.length);
  };

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
