import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useParams, useLocation, Link, NavLink, Outlet, Routes, Route, useMatch } from "react-router-dom";
import { axiosInstance, IMAGE_URL } from "../../App";
import css from "./MovieDetailsPage.module.css";
import Loader from "../../components/Loader/Loader";

const getMovieDetails = async (movieId) => {
  const response = await axiosInstance.get(`/movie/${movieId}`);
  return response.data;
};

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const backLinkLocation = useRef(location.state?.from || '/movies');

  const castMatch = useMatch("/movies/:movieId/cast");
  const reviewsMatch = useMatch("/movies/:movieId/reviews");

  useEffect(() => {
    if (!movieId) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);
      } catch (error) {
        console.error("Помилка при отриманні деталей фільму:", error);
        setError("Не вдалося завантажити інформацію про фільм.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [movieId]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-center text-red-400 mt-10">{error}</p>;
  }

  if (!movie) {
    return null;
  }

  return (
    <div className={css.container}>
      <Link
        to={backLinkLocation.current}
        className={css.backLink}
      >
        &#8592; Назад
      </Link>
      <div className={css.detailsContainer}>
        <div className="flex-shrink-0">
          <img
            src={movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://placehold.co/500x750?text=No+Image'}
            alt={movie.title}
            className={css.image}
          />
        </div>
        <div className={css.content}>
          <h1 className={css.title}>
            {movie.title} ({new Date(movie.release_date).getFullYear()})
          </h1>
          <p className={css.rating}>Рейтинг: {Math.round(movie.vote_average * 10)}%</p>
          <h2 className={css.overviewHeading}>Огляд</h2>
          <p className={css.overviewText}>{movie.overview}</p>
          <h3 className={css.genresHeading}>Жанри</h3>
          <p className={css.genresText}>{movie.genres.map((genre) => genre.name).join(', ')}</p>

          <hr className={css.separator} />

          <div className={css.navContainer}>
            <NavLink
              to={castMatch ? "" : "cast"}
              className={({ isActive }) =>
                isActive
                  ? `${css.navLink} ${css.navLinkActive}`
                  : `${css.navLink} ${css.navLinkInactive}`
              }
            >
              Акторський склад
            </NavLink>
            <NavLink
              to={reviewsMatch ? "" : "reviews"}
              className={({ isActive }) =>
                isActive
                  ? `${css.navLink} ${css.navLinkActive}`
                  : `${css.navLink} ${css.navLinkInactive}`
              }
            >
              Відгуки
            </NavLink>
          </div>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;