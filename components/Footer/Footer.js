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
                        <Image src="/logo.png" alt="Logo" width={50} height={50} className={styles.logo} />
                    </Link>
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
                                <Link href="/python/python-intro" passHref>Python</Link>
                            </li>
                            <li>
                                <Link href="/java/java" passHref>Java</Link>
                            </li>
                            <li>
                                <Link href="/cpp/cpp" passHref>C++</Link>
                            </li>
                            <li>
                                <Link href="/sql/sql" passHref>SQL</Link>
                            </li>
                            <li>
                                <Link href="/php/php" passHref>PHP</Link>
                            </li>
                            <li>
                                <Link href="/c/c" passHref>C</Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.section}>
                        <h4>Data Structures</h4>
                        <ul>
                            <li>
                                <Link href="/arrays/arrays" passHref>Arrays</Link>
                            </li>
                            <li>
                                <Link href="/stacks/stacks" passHref>Stacks</Link>
                            </li>
                            <li>
                                <Link href="/queues/queues" passHref>Queues</Link>
                            </li>
                            <li>
                                <Link href="/linked-lists/linked-lists" passHref>Linked Lists</Link>
                            </li>
                            <li>
                                <Link href="/trees/trees" passHref>Trees</Link>
                            </li>
                            <li>
                                <Link href="/graphs/graphs" passHref>Graphs</Link>
                            </li>
                            <li>
                                <Link href="/has-tables/hash-tables" passHref>Hash Tables</Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.section}>
                        <h4>Algorithms</h4>
                        <ul>
                            <li>
                                <Link href="/searching-algorithms/searching-algorithms" passHref>Searching Algorithm</Link>
                            </li>
                            <li>
                                <Link href="/sorting-algorithms/sorting-algorithms" passHref>Sorting Algorithm</Link>
                            </li>
                            <li>
                                <Link href="/recursion-algorithms/recursion-algorithms" passHref>Recursion Algorithm</Link>
                            </li>
                            <li>
                                <Link href="/greedy-algorithms/greedy-algorithms" passHref>Greedy Algorithm</Link>
                            </li>
                            <li>
                                <Link href="/dynamic-programming/dynamic-programming" passHref>Dynamic Programming</Link>
                            </li>
                            <li>
                                <Link href="/divide-and-conquer/divide-and-conquer" passHref>Divide and Conquer</Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.section}>
                        <h4>Web Development</h4>
                        <ul>
                            <li>
                                <Link href="/html/html" passHref>HTML</Link>
                            </li>
                            <li>
                                <Link href="/css/css" passHref>CSS</Link>
                            </li>
                            <li>
                                <Link href="/javascript/javascript" passHref>JavaScript</Link>
                            </li>
                            <li>
                                <Link href="/reactjs/reactjs" passHref>ReactJS</Link>
                            </li>
                            <li>
                                <Link href="/nextjs/nextjs" passHref>NextJS</Link>
                            </li>
                            <li>
                                <Link href="/nodejs/nodejs" passHref>NodeJS</Link>
                            </li>
                            <li>
                                <Link href="/bootstrap/bootstrap" passHref>Bootstrap</Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.section}>
                        <h4>DevOps</h4>
                        <ul>
                            <li>
                                <Link href="/gtihub/github" passHref>GitHub</Link>
                            </li>
                            <li>
                                <Link href="/git/git" passHref>Git</Link>
                            </li>
                            <li>
                                <Link href="/amazon-web-services/amazon-web-services" passHref>AWS</Link>
                            </li>
                            <li>
                                <Link href="/azure/azure" passHref>Azure</Link>
                            </li>
                            <li>
                                <Link href="/docker/docker" passHref>Docker</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
