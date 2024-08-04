import styles from './Footer.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { FaYoutube, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.leftContainer}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="Logo" width={50} height={50} className={styles.logo} />
          <span className={styles.siteName}>WebDevsNest</span>
        </div>
        <div className={styles.socials}>
          <div className={styles.socialLinks}>
            <Link href="https://www.youtube.com" passHref>
              <span className={styles.socialLink}>
                <FaYoutube size={30} />
              </span>
            </Link>
            <Link href="https://www.tiktok.com" passHref>
              <span className={styles.socialLink}>
                <FaTiktok size={30} />
              </span>
            </Link>
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
                <Link href="/languages/python" passHref>Python</Link>
              </li>
              <li>
                <Link href="/languages/java" passHref>Java</Link>
              </li>
              <li>
                <Link href="/languages/cpp" passHref>C++</Link>
              </li>
              <li>
                <Link href="/languages/sql" passHref>SQL</Link>
              </li>
              <li>
                <Link href="/languages/php" passHref>PHP</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>Data Structures</h4>
            <ul>
              <li>
                <Link href="/data-structures" passHref>Arrays</Link>
              </li>
              <li>
                <Link href="/data-structures" passHref>Stacks</Link>
              </li>
              <li>
                <Link href="/data-structures" passHref>Queues</Link>
              </li>
              <li>
                <Link href="/data-structures" passHref>Linked Lists</Link>
              </li>
              <li>
                <Link href="/data-structures" passHref>Trees</Link>
              </li>
              <li>
                <Link href="/data-structures" passHref>Graphs</Link>
              </li>
              <li>
                <Link href="/data-structures" passHref>Hash Tables</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>Algorithms</h4>
            <ul>
              <li>
                <Link href="/algorithms" passHref>Searching Algorithm</Link>
              </li>
              <li>
                <Link href="/algorithms" passHref>Sorting Algorithm</Link>
              </li>
              <li>
                <Link href="/algorithms" passHref>Recursion Algorithm</Link>
              </li>
              <li>
                <Link href="/algorithms" passHref>Greedy Algorithm</Link>
              </li>
              <li>
                <Link href="/algorithms" passHref>Dynamic Programming</Link>
              </li>
              <li>
                <Link href="/algorithms" passHref>Divide and Conquer</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>Web Development</h4>
            <ul>
              <li>
                <Link href="/web-development/html" passHref>HTML</Link>
              </li>
              <li>
                <Link href="/web-development/css" passHref>CSS</Link>
              </li>
              <li>
                <Link href="/web-development/javascript" passHref>JavaScript</Link>
              </li>
              <li>
                <Link href="/web-development/reactjs" passHref>ReactJS</Link>
              </li>
              <li>
                <Link href="/web-development/nextjs" passHref>NextJS</Link>
              </li>
              <li>
                <Link href="/web-development/bootstrap" passHref>Bootstrap</Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h4>DevOps</h4>
            <ul>
              <li>
                <Link href="/web-development/html" passHref>GitHub</Link>
              </li>
              <li>
                <Link href="/web-development/css" passHref>Git</Link>
              </li>
              <li>
                <Link href="/web-development/javascript" passHref>AWS</Link>
              </li>
              <li>
                <Link href="/web-development/reactjs" passHref>Azure</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
