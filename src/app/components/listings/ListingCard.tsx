'use client';

import { Listing, Reservation } from '@prisma/client';
import { useRouter } from 'next/navigation';

import useContries from '@/app/hooks/useCountries';
import { SafeUser } from '@/app/types';

import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import Button from '../Button';
import Slider from '../Carousel';
import HeartButton from '../HeartButton';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

type ListingCardProps = {
  data: Listing;
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

  const imagesArray = Array.isArray(data.imageSrc)
    ? data.imageSrc
    : [data.imageSrc];

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
  return (
    <div
      className='col-span-1 cursor-pointer group'
      onClick={() => router.push(`/listings/${data.id}`)}
    >
      <div className='flex flex-col w-full gap-2'>
        {/* <Slider
          id={data.id}
          images={
            Array.isArray(data.imageSrc) ? data.imageSrc : [data.imageSrc]
          }
          currentUser={currentUser}
        /> */}
        <Carousel
          infiniteLoop
          autoPlay
          showArrows
          showThumbs={false}
          showStatus={false}
        >
          {imagesArray.map((img, i) => (
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
        </Carousel>
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
