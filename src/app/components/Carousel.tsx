'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import HeartButton from './HeartButton';
import { SafeUser } from '../types';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

type SliderProps = {
  images: string[];
  id: string;
  currentUser?: SafeUser | null;
};

const Slider: React.FC<SliderProps> = ({ id, images, currentUser }) => {
  const router = useRouter();
  return (
    <Carousel
      infiniteLoop
      autoPlay
      showArrows
      showThumbs={false}
      showStatus={false}
      stopOnHover
      swipeable
    >
      {images.map((img, i) => (
        <div
          key={i}
          onClick={() => router.push(`/listings/${id}`)}
          className='aspect-square w-full relative overflow-hidden rounded-xl'
        >
          <Image
            fill
            alt='Listing'
            src={img}
            className='object-cover h-full w-full group-hover:scale-110 transition'
          />
          <div className='absolute top-3 right-3'>
            <HeartButton listingId={id} currentUser={currentUser} />
          </div>
        </div>
      ))}
    </Carousel>
  );
};
export default Slider;
