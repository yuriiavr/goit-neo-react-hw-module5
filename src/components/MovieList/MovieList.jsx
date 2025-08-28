import { Link, useLocation } from "react-router-dom";
import { IMAGE_URL } from "../../App";
import css from "./MovieList.module.css";

const MovieList = ({ movies }) => {
  const location = useLocation();

  return (
    <ul className={css.movieList}>
      {movies.map((movie) => (
        <li key={movie.id} className={css.movieListItem}>
          <Link to={`/movies/${movie.id}`} state={{ from: location }}>
            <img
              src={movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://placehold.co/500x750?text=No+Image'}
              alt={movie.title}
              className={css.movieListImage}
            />
            <div className={css.movieListTitleContainer}>
              <h3 className={css.movieListTitle}>{movie.title}</h3>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MovieList;