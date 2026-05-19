"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";

const images = [
  "../assets/andrew-solomon-new-york-city-townhouse-0317-9.webp",
  "../assets/Feature_Headshot-1.webp"

];

const Banner = () => {
  return (
    <div className="relative h-[600px] overflow-hidden">

      {/* 🔥 Background Slider */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 🔥 Overlay */}
      <div className="absolute inset-0 bg-black/5 z-10"></div>

      {/* 🔥 Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-7xl text-white font-bold">
         Find Your Perfect Study Room
        </h1>
        <p className="text-xl text-white font-bold">Browse and book quiet, private study rooms in your library. List your own room and earn</p>

        <Link
          href="/all-rooms"
          className="mt-6 px-6 py-3 font-bold bg-purple-700 text-white rounded-lg hover:bg-gradient transition"
        >
          Explore Rooms
        </Link>
      </div>

    </div>
  );
};

export default Banner;