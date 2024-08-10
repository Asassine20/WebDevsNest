import Head from 'next/head';
import styles from '../styles/AboutUs.module.css';
import Image from 'next/image';

const AboutUs = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>About WebDevsNest</title>
        <meta name="description" content="Learn more about WebDevsNest, the platform designed to help you grow from basic programming skills to advanced real-world applications." />
      </Head>
      <div className={styles.creatorSection}>
        <h1 className={styles.title}>About the Creator</h1>
        <div className={styles.creatorContent}>
          <div className={styles.creatorImage}>
            <Image
              src="/headshot.jpeg"
              alt="Creator's Image"
              width={200}
              height={200}
              className={styles.image}
            />
          </div>
          <div className={styles.creatorText}>
            <p>
              WebDevsNest was founded by Andrew Sassine, a software engineer with a vision to provide programmers with the tools they need to grow from the very basics to building real-world projects. Whether you're just starting out or looking to deepen your knowledge, WebDevsNest offers a comprehensive range of resources that allow you to not only learn programming but also apply it effectively.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.coreValuesSection}>
        <h2 className={styles.title}>Our Core Values</h2>
        <ul className={styles.valuesList}>
          <li>
            <strong>Empowerment through Knowledge:</strong> We believe in empowering developers by providing clear, concise, and practical learning resources that go beyond just the theory.
          </li>
          <li>
            <strong>Real-World Application:</strong> Our goal is to ensure that every concept you learn can be directly applied to real-world projects, enabling you to build and innovate with confidence.
          </li>
          <li>
            <strong>Continuous Growth:</strong> Programming is an ever-evolving field, and we’re committed to helping you stay updated with the latest technologies and best practices.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
