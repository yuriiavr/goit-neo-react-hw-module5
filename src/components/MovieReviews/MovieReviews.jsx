import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../App";
import css from "./MovieReviews.module.css";
import Loader from "../Loader/Loader";

const getMovieReviews = async (movieId) => {
  const response = await axiosInstance.get(`/movie/${movieId}/reviews`);
  return response.data.results;
};

const MovieReviews = () => {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const reviewsData = await getMovieReviews(movieId);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Помилка при отриманні відгуків:", error);
        setError("Не вдалося завантажити відгуки.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [movieId]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (reviews.length === 0) {
    return <p>Відгуки відсутні.</p>;
  }

  return (
    <div className={css.container}>
      <h2 className={css.heading}>Відгуки</h2>
      <ul className={css.list}>
        {reviews.map((review) => (
          <li key={review.id} className={css.item}>
            <h4 className={css.author}>{review.author}</h4>
            <p className={css.content}>{review.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieReviews;