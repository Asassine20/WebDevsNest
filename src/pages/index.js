import SearchBarWithoutLogin from '../../components/SearchBarWithoutLogin/SearchBarWithoutLogin';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const Home = () => {
  const sections = [
    { title: 'Languages', link: '/languages', items: ['Python', 'Java', 'C++', 'SQL', 'C', 'C#', 'PHP', 'R', 'Flutter', 'GoLang'] },
    { title: 'Data Structures', link: '/data-structures', items: ['Arrays', 'Strings', 'Stacks', 'Queues', 'Linked Lists', 'Trees', 'Graphs', 'Hash Tables', 'Heaps', 'Matrix'] },
    { title: 'Algorithms', link: '/algorithms', items: ['Searching Algorithms', 'Sorting Algorithms', 'Recursion Algorithms', 'Greedy Algorithms', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking Algorithms', 'Graph Algorithms', 'Pattern Searching', 'Mathemtical Algorithms'] },
    { title: 'Web Development', link: '/web-development', items: ['HTML', 'CSS', 'JavaScript', 'ReactJS', 'NextJS', 'Frontend Development', 'Backend Development', 'NodeJS', 'Django', 'Bootstrap'] },
    { title: 'DevOps', link: '/devops', items: ['GitHub', 'Git', 'Amazon Web Services', 'Azure', 'CI/CD', 'Docker', 'Kubernetes', 'Jenkins', 'Google Cloud Services'] },
    { title: 'Databases', link: '/databases', items: ['SQL', 'MySQL', 'Microsoft SQL Server', 'MongoDB', 'PostgreSQL', 'PL/SQL', 'SQLite', 'MariaDB', 'IBM Db2']}
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

  const generateLink = (item) => {
    const alias = aliasMapping[item] || item.toLowerCase().replace(/\s+/g, '-');
    return `/${alias}/${alias}-introduction`;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.mainHeader}>Learn to program</h1>
        <h2 className={styles.subHeader}>Grow from basic fundamentals to complex concepts</h2>
        <div className={styles.searchContainer}>
          <SearchBarWithoutLogin />
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
                <Link key={idx} href={generateLink(item)} passHref>
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
