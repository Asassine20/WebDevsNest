import '../styles/globals.css';
import SearchBar from '../../components/SearchBar/SearchBar';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SearchBar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
