import React from "react";
import { Link } from "react-router-dom";
import css from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={css.container}>
      <h1 className={css.heading}>404 - Сторінку не знайдено</h1>
      <p className={css.text}>Вибачте, але такої сторінки не існує.</p>
      <Link to="/" className={css.link}>
        Повернутися на головну
      </Link>
    </div>
  );
};

export default NotFoundPage;