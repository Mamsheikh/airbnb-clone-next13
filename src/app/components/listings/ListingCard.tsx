'use client';

import { Reservation, Listing, Image, Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';

import useContries from '@/app/hooks/useCountries';
import { SafeUser } from '@/app/types';

import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
// import Image from 'next/image';
import Button from '../Button';
import Slider from '../Carousel';
import HeartButton from '../HeartButton';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

type ListingWithImages = Prisma.ListingGetPayload<{
  include: { images: true | Prisma.ImageFindManyArgs };
}>;

type ListingCardProps = {
  data: ListingWithImages;
  reservation?: Reservation;
  currentUser?: SafeUser | null;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionId?: string;
  actionLabel?: string;
};

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  actionId = '',
  currentUser,
  disabled,
  onAction,
  actionLabel,
}) => {
  const router = useRouter();

  const imagesArray = data.images.map((i) => i.src);

  const { getByValue } = useContries();

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) return;

      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) return null;

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  // const [imageList, setImageList] = useState<string[]>([]);

  // useEffect(() => {
  //   if (typeof data.imageSrc === 'string') {
  //     setImageList([data.imageSrc]);
  //   } else {
  //     setImageList(data.imageSrc);
  //   }
  // }, [data.imageSrc]);
  return (
    <div className='col-span-1 cursor-pointer group'>
      <div className='flex flex-col w-full gap-2'>
        <Slider id={data.id} images={imagesArray} currentUser={currentUser} />
        {/* <Carousel
          infiniteLoop
          autoPlay
          showArrows
          showThumbs={false}
          showStatus={false}
        >
          {data..map((img, i) => (
            <div
              key={i}
              className='aspect-square w-full relative overflow-hidden rounded-xl'
            >
              <Image
                fill
                alt='Listing'
                src={img}
                className='object-cover h-full w-full group-hover:scale-110 transition'
              />
              <div className='absolute top-3 right-3'>
                <HeartButton listingId={data.id} currentUser={currentUser} />
              </div>
            </div>
          ))}
        </Carousel> */}
        <div className='font-semibold text-lg'>
          {location?.region}, {location?.label}
        </div>
        <div className='font-light text-neutral-500'>
          {reservationDate || data.category}
        </div>
        <div className='flex flex-row items-center gap-1'>
          <div className='font-semibold'>$ {price}</div>
          {!reservation && <div className='font-light'>night</div>}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};
export default ListingCard;
