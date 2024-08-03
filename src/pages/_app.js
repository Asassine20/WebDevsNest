import '../styles/globals.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SearchBar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
