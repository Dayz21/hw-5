"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";

import type { FilmType } from "@/shared/store/models/Film";
import { Card } from "@/shared/components/Card/Card";
import { CardSkeleton } from "@/shared/components/Card/CardSkeleton";
import { Button } from "@/shared/components/Button/Button";
import { BackControlButton, FrontControlButton } from "@/shared/components/CarouselControls";

import "swiper/css";
import styles from "./FilmsCarousel.module.scss";

export type FilmsCarouselProps = {
    films: FilmType[];
    loading?: boolean;
    onFilmClick?: (film: FilmType) => void;
    isAuthorized?: boolean;
    isFavorite?: (filmId: FilmType["id"]) => boolean;
    onToggleFavorite?: (filmId: FilmType["id"]) => void;
};

export const FilmsCarousel: React.FC<FilmsCarouselProps> = ({
    films,
    loading = false,
    onFilmClick,
    isAuthorized,
    isFavorite,
    onToggleFavorite,
}) => {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div className={styles.container}>
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                spaceBetween={10}
                slidesPerView={1}
                loop
                resizeObserver
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    1400: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                }}
            >
                {loading
                    ? Array(6)
                          .fill(0)
                          .map((_, index) => (
                              <SwiperSlide key={index}>
                                  <CardSkeleton />
                              </SwiperSlide>
                          ))
                    : films.map((film) => (
                          <SwiperSlide key={film.id}>
                              <Card film={film} onClick={() => onFilmClick?.(film)}>
                                  {isAuthorized && (
                                      <Button onClick={() => onToggleFavorite?.(film.id)} outlined>
                                          {isFavorite?.(film.id) ? "В избранном" : "В избранное"}
                                      </Button>
                                  )}
                                  <Button onClick={() => onFilmClick?.(film)}>Смотреть</Button>
                              </Card>
                          </SwiperSlide>
                      ))}
            </Swiper>

            <BackControlButton onClick={() => swiperRef.current?.slidePrev()} />
            <FrontControlButton onClick={() => swiperRef.current?.slideNext()} />
        </div>
    );
};
