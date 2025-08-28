import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance, IMAGE_URL } from "../../App";
import Loader from "../Loader/Loader";
import css from "./MovieCast.module.css";

const getMovieCast = async (movieId) => {
  const response = await axiosInstance.get(`/movie/${movieId}/credits`);
  return response.data.cast;
};

const MovieCast = () => {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchCast = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const castData = await getMovieCast(movieId);
        setCast(castData);
      } catch (error) {
        console.error("Помилка при отриманні акторського складу:", error);
        setError("Не вдалося завантажити акторський склад.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCast();
  }, [movieId]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (cast.length === 0) {
    return <p>Інформація про акторський склад відсутня.</p>;
  }

  return (
    <div className={css.container}>
      <h2 className={css.heading}>Акторський склад</h2>
      <ul className={css.list}>
        {cast.map((actor) => (
          <li key={actor.id} className={css.item}>
            <img
              src={actor.profile_path ? `${IMAGE_URL}${actor.profile_path}` : 'https://placehold.co/500x750?text=No+Image'}
              alt={actor.name}
              className={css.image}
            />
            <p className={css.name}>{actor.name}</p>
            <p className={css.character}>{actor.character}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieCast;