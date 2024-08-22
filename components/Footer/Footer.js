import styles from './Footer.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { FaYoutube, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.leftContainer}>
        <div className={styles.logoContainer}>
          <Link href='/'>
            <Image src="/logo.png" alt="Logo" width={80} height={40} className={styles.logo} />
          </Link>
          <span className={styles.siteName}>WebDevsNest</span>
        </div>
        <div className={styles.socials}>
          <div className={styles.socialLinks}>
            <a href="https://www.youtube.com/@WebDevsNest" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaYoutube size={28} />
            </a>
            <a href="https://www.tiktok.com/@webdevsnest?lang=en" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaTiktok size={28} />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.sectionsContainer}>
        <div className={styles.sections}>
          <div className={styles.section}>
            <h4>About Us</h4>
            <ul>
              <li>
                <Link href="/about-us" passHref>About Us</Link>
              </li>
              <li>
                <Link href="/contact-us" passHref>Contact Us</Link>
              </li>
              <li>
                <Link href="/advertise-with-us" passHref>Advertise With Us</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>Languages</h4>
            <ul>
              <li>
                <Link href="/python/python-introduction" passHref>Python</Link>
              </li>
              <li>
                <Link href="/java/java-introduction" passHref>Java</Link>
              </li>
              <li>
                <Link href="/cpp/cpp-introduction" passHref>C++</Link>
              </li>
              <li>
                <Link href="/sql/sql-introduction" passHref>SQL</Link>
              </li>
              <li>
                <Link href="/php/php-introduction" passHref>PHP</Link>
              </li>
              <li>
                <Link href="/c/c-introduction" passHref>C</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>Data Structures</h4>
            <ul>
              <li>
                <Link href="/data-structures/arrays" passHref>Arrays</Link>
              </li>
              <li>
                <Link href="/data-structures/stacks" passHref>Stacks</Link>
              </li>
              <li>
                <Link href="/data-structures/queues" passHref>Queues</Link>
              </li>
              <li>
                <Link href="/data-structures/linked-lists" passHref>Linked Lists</Link>
              </li>
              <li>
                <Link href="/data-structures/trees" passHref>Trees</Link>
              </li>
              <li>
                <Link href="/data-structures/graphs" passHref>Graphs</Link>
              </li>
              <li>
                <Link href="/data-structures/hash-tables" passHref>Hash Tables</Link>
              </li>
              <li>
                <Link href="/data-structures/heaps" passHref>Heaps</Link>
              </li>
              <li>
                <Link href="/data-structures/matrices" passHref>Matrices</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>Algorithms</h4>
            <ul>
              <li>
                <Link href="/algorithms/searching-algorithms" passHref>Searching Algorithm</Link>
              </li>
              <li>
                <Link href="/algorithms/sorting-algorithms" passHref>Sorting Algorithm</Link>
              </li>
              <li>
                <Link href="/algorithms/recursion-algorithms" passHref>Recursion Algorithm</Link>
              </li>
              <li>
                <Link href="/algorithms/greedy-algorithms" passHref>Greedy Algorithm</Link>
              </li>
              <li>
                <Link href="/algorithms/dynamic-programming" passHref>Dynamic Programming</Link>
              </li>
              <li>
                <Link href="/algorithms/divide-and-conquer" passHref>Divide and Conquer</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>Web Development</h4>
            <ul>
              <li>
                <Link href="/html/html-introduction" passHref>HTML</Link>
              </li>
              <li>
                <Link href="/css/css-introduction" passHref>CSS</Link>
              </li>
              <li>
                <Link href="/javascript/javascript-introduction" passHref>JavaScript</Link>
              </li>
              <li>
                <Link href="/react/react-introduction" passHref>React</Link>
              </li>
              <li>
                <Link href="/next/next-introduction" passHref>Next</Link>
              </li>
              <li>
                <Link href="/nodejs/nodejs-introduction" passHref>Node.js</Link>
              </li>
              <li>
                <Link href="/bootstrap/bootstrap-introduction" passHref>Bootstrap</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>DevOps</h4>
            <ul>
              <li>
                <Link href="/github/github-introduction" passHref>GitHub</Link>
              </li>
              <li>
                <Link href="/git/git-introduction" passHref>Git</Link>
              </li>
              <li>
                <Link href="/amazon-web-services/amazon-web-services-introduction" passHref>AWS</Link>
              </li>
              <li>
                <Link href="/azure/azure-introduction" passHref>Azure</Link>
              </li>
              <li>
                <Link href="/docker/docker-introduction" passHref>Docker</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
