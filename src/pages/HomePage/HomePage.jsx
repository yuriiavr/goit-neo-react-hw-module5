import { useState, useEffect } from "react";
import { axiosInstance } from "../../App";
import MovieList from "../../components/MovieList/MovieList";
import css from "./HomePage.module.css";
import Loader from "../../components/Loader/Loader";

const fetchTrendingMovies = async () => {
  const response = await axiosInstance.get("/trending/movie/day");
  return response.data.results;
};

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const movies = await fetchTrendingMovies();
        setTrendingMovies(movies);
      } catch (error) {
        console.error("Помилка при отриманні трендових фільмів:", error);
        setError("Не вдалося завантажити популярні фільми.");
      } finally {
        setIsLoading(false);
      }
    };
    getMovies();
  }, []);

  return (
    <div className={css.container}>
      <h1 className={css.heading}>Популярні фільми на сьогодні</h1>
      {isLoading && <Loader />}
      {error && <p>{error}</p>}
      {trendingMovies.length > 0 && <MovieList movies={trendingMovies} />}
      {!isLoading && !error && trendingMovies.length === 0 && (
        <p>
          Немає популярних фільмів для відображення.
        </p>
      )}
    </div>
  );
};

export default HomePage;
