import SearchBarWithoutLogin from '../../components/SearchBarWithoutLogin/SearchBarWithoutLogin';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.mainHeader}>Learn to program</h1>
        <h2 className={styles.subHeader}>Grow from basic fundamentals to complex concepts</h2>
        <div className={styles.searchContainer}>
          <SearchBarWithoutLogin />
        </div>
      </div>
    </div>
  );
};

export default Home;
