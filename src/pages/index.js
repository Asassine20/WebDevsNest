import Head from 'next/head';
import SearchBar from '../../components/SearchBar/SearchBar'; // Use the SearchBar component here
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const Home = () => {
  const sections = [
    { title: 'Artificial Intelligence (AI)', link: '/ai', items: ['AI', 'Machine Learning', 'Deep Learning', 'Generative AI', 'Natural Language Processing', 'Computer Vision'] },
    { title: 'Languages', link: '/languages', items: ['Python', 'Java', 'C++', 'SQL', 'C', 'C#', 'PHP', 'Flutter', 'Golang'] },
    { title: 'Data Structures', link: '/data-structures', items: ['Arrays', 'Stacks', 'Queues', 'Linked Lists', 'Trees', 'Graphs', 'Hash Tables', 'Heaps', 'Matrix'] },
    { title: 'Algorithms', link: '/algorithms', items: ['Searching Algorithms', 'Sorting Algorithms', 'Recursion Algorithms', 'Greedy Algorithms', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking Algorithms', 'Graph Algorithms', 'Mathematical Algorithms'] },
    { title: 'Web Development', link: '/web-development', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Next', 'Nodejs', 'VueJS', 'Backend Development', 'Angular', 'Django'] },
    { title: 'DevOps', link: '/devops', items: ['GitHub', 'Git', 'Amazon Web Services', 'Azure', 'Docker'] },
    { title: 'Databases', link: '/databases', items: ['SQL', 'MySQL', 'MongoDB', 'PostgreSQL']}
  ];

  const bgColors = [
    styles.bgColor1,
    styles.bgColor2,
    styles.bgColor3,
  ];

  // Custom alias mapping for certain items
  const aliasMapping = {
    'C++': 'cpp',
    'C#': 'csharp'
  };

  const generateLink = (item, sectionTitle) => {
    const alias = aliasMapping[item] || item.toLowerCase().replace(/\s+/g, '-');
    
    if (sectionTitle === 'Data Structures') {
      return `/data-structures/${alias}`;
    }
    
    if (sectionTitle === 'Algorithms') {
      return `/algorithms/${alias}`;
    }
    
    return `/${alias}/${alias}-introduction`;
  };

  return (
    <div className={styles.pageContainer}>
      <Head>
        <title>WebDevsNest - Learn to Program</title>
        <meta name="description" content="Master programming with WebDevsNest! Access expert tutorials, coding tips, and resources for Python, Java, C++, and more. Solve coding questions, learn algorithms, and boost your career with in-demand skills today." />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.mainHeader}>Learn to program</h1>
        <h2 className={styles.subHeader}>Grow from basic fundamentals to complex concepts</h2>
        <div className={styles.searchContainer}>
          <SearchBar />
        </div>
      </div>
      <div className={styles.sectionsContainer}>
        {sections.map((section, index) => (
          <div key={index} className={`${styles.section} ${bgColors[index % bgColors.length]}`}>
            <div className={styles.sectionHeader}>
              <h3>{section.title}</h3>
            </div>
            <div className={`${styles.itemsContainer} ${bgColors[index % bgColors.length]}`}>
              {section.items.map((item, idx) => (
                <Link key={idx} href={generateLink(item, section.title)} passHref>
                  <div className={styles.item}><span>{item}</span></div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
