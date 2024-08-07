import SearchBarWithoutLogin from '../../components/SearchBarWithoutLogin/SearchBarWithoutLogin';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const Home = () => {
  const sections = [
    { title: 'Languages', link: '/languages', items: ['Python', 'Java', 'C++', 'SQL', 'C', 'C#', 'Flutter', 'GoLang'] },
    { title: 'Data Structures', link: '/data-structures', items: ['Arrays', 'Stacks', 'Linked Lists', 'Trees', 'Graphs', 'Hash Tables'] },
    { title: 'Algorithms', link: '/algorithms', items: ['Searching Algorithms', 'Sorting Algorithms', 'Recursion Algorithms', 'Greedy Algorithms', 'Dynamic Programming', 'Divide and Conquer'] },
    { title: 'Web Development', link: '/web-development', items: ['HTML', 'CSS', 'JavaScript', 'PHP', 'ReactJS', 'NextJS', 'Bootstrap'] },
    { title: 'DevOps', link: '/devops', items: ['GitHub', 'Git', 'AWS', 'Azure', 'CI/CD', 'Docker', 'Kubernetes'] },
  ];

  const bgColors = [
    styles.bgColor1,
    styles.bgColor2,
    styles.bgColor3,
  ];

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
              <Link href={section.link} passHref>
                <span className={`${styles.viewAll} ${bgColors[index % bgColors.length]}-link`}>View All</span>
              </Link>
            </div>
            <div className={`${styles.itemsContainer} ${bgColors[index % bgColors.length]}`}>
              {section.items.map((item, idx) => (
                <Link key={idx} href={`/${item.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`} passHref>
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
