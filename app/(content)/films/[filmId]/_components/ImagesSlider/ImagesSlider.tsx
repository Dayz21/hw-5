"use client";

import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { BackControlButton, FrontControlButton } from "@/shared/components/CarouselControls";
import { Image } from "@/shared/components/Image";

import "swiper/css";
import styles from "./ImagesSlider.module.scss";

type Props = {
    images: string[];
    className?: string;
};

export const ImagesSlider: React.FC<Props> = ({ images, className }) => {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div style={{ position: "relative" }}>
            <Swiper
                className={className}
                spaceBetween={20}
                slidesPerView={3}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    768: { slidesPerView: 2, spaceBetween: 10 },
                    1400: { slidesPerView: 3, spaceBetween: 20 },
                }}
                resizeObserver
                loop
            >
                {images.map((src, index) => (
                    <SwiperSlide key={index}>
                        <Image
                            src={src}
                            alt=""
                            width="100%"
                            aspect={16 / 9}
                            className={styles.image}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <FrontControlButton onClick={() => swiperRef.current?.slideNext()} />
            <BackControlButton onClick={() => swiperRef.current?.slidePrev()} />
        </div>
    );
};
