import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../App";
import MovieList from "../../components/MovieList/MovieList";
import Loader from "../../components/Loader/Loader";
import css from "./MoviesPage.module.css";

const searchMovies = async (query) => {
  const response = await axiosInstance.get('/search/movie', {
    params: { query },
  });
  return response.data.results;
};

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const query = searchParams.get('query') || '';

  useEffect(() => {
    if (!query) {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const moviesData = await searchMovies(query);
        setMovies(moviesData);
      } catch (error) {
        console.error("Помилка при пошуку фільмів:", error);
        setError("Не вдалося виконати пошук. Спробуйте пізніше.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newQuery = e.target.elements.search.value.trim();
    if (newQuery) {
      setSearchParams({ query: newQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className={css.container}>
      <form onSubmit={handleSearch} className={css.form}>
        <input
          type="text"
          name="search"
          defaultValue={query}
          placeholder="Пошук фільмів..."
          className={css.input}
        />
        <button type="submit" className={css.button}>
          Пошук
        </button>
      </form>
      {isLoading && <Loader />}
      {error && <p>{error}</p>}
      {movies.length > 0 && <MovieList movies={movies} />}
      {!isLoading && !error && movies.length === 0 && query && (
        <p>За вашим запитом фільмів не знайдено.</p>
      )}
    </div>
  );
};

export default MoviesPage;