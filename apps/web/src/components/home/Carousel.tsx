'use effect';
import Image, { ImageProps } from 'next/image';
import React, { useEffect, useState } from 'react';
import carousel_image_1 from '@/media/carousel/carousel_image_1.webp';
import carousel_image_2 from '@/media/carousel/carousel_image_2.webp';
import carousel_image_3 from '@/media/carousel/carousel_image_3.webp';
import left_arrow from '@/media/icons/left-arrow.svg';
import right_arrow from '@/media/icons/right-arrow.svg';

const slides = [carousel_image_1, carousel_image_2, carousel_image_3];

function Carousel() {
  const [currSlide, setCurrSlide] = useState(0);

  function prevSlide() {
    setCurrSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1,
    );
  }

  function nextSlide() {
    setCurrSlide((prevSlide) =>
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1,
    );
  }

  useEffect(() => {
    const interval = setTimeout(() => {
      nextSlide();
    }, 5000);
    return () => clearTimeout(interval);
  }, [currSlide]);

  return (
    <div className="flex mt-4 xl:h-[392.85px] max-w-[1272px] bg-blue-200 overflow-hidden relative xl:rounded-2xl">
      <Image src={slides[currSlide]} alt="caroursel-image-one"></Image>
      <div className="flex justify-between items-center p-2 absolute top-0 bottom-0 left-0 right-0">
        <button
          className="hidden xl:block p-2 bg-white rounded-3xl hover:border-gray-500 border-2"
          onClick={prevSlide}
        >
          <Image
            src={left_arrow}
            alt="previous slide arrow"
            className="w-6"
          ></Image>
        </button>
        <button className="hidden xl:block p-2 bg-white rounded-3xl hover:border-gray-500 border-2">
          {' '}
          <Image
            src={right_arrow}
            alt="next slide arrow"
            className="w-6"
            onClick={nextSlide}
          ></Image>
        </button>
      </div>
    </div>
  );
}

export default Carousel;
