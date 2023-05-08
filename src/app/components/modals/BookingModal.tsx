'use client';
import { AiFillGithub } from 'react-icons/ai';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import { Range } from 'react-date-range';
import { signIn } from 'next-auth/react';
import useLoginModal from '@/app/hooks/useLoginModal';
import useBookModal from '@/app/hooks/useBookModal';
import { useRouter } from 'next/navigation';

type BookingModalProps = {
  totalPrice: number;
  dateRange: Range;
  listingId: string;
  setDateRange: Dispatch<SetStateAction<Range>>;
  initialDateRange: {
    startDate: Date;
    endDate: Date;
    key: string;
  };
};

const BookingModal: React.FC<BookingModalProps> = ({
  totalPrice,
  dateRange,
  listingId,
  setDateRange,
  initialDateRange,
}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const loginModal = useLoginModal();
  const bookingModal = useBookModal();

  const stripe = useStripe();
  const elements = useElements();

  const handleCreateBooking = async () => {
    if (!stripe || !elements) {
      return toast.error("Sorry! We weren't able to connect with Stripe");
    }

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { token: stripeToken, error } = await stripe.createToken(
        cardElement,
      );

      if (stripeToken) {
        axios.post('/api/stripe', {});
        // createBooking({
        //   variables: {
        //     input: {
        //       id: id,
        //       source: stripeToken.id,
        //       checkIn: moment(checkInDate).format("YYYY-MM-DD"),
        //       checkOut: moment(checkOutDate).format("YYYY-MM-DD"),
        //     },
        //   },
        // });
      } else {
        toast.error(
          error?.message ??
            "Sorry! We weren't able to book the listing. Please try again later.",
        );
      }
    }
  };

  const onCreateReservation = useCallback(async () => {
    // if (!stripe || !elements) {
    //   return toast.error("Sorry! We weren't able to connect with Stripe");
    // }

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { token: stripeToken, error } = await stripe.createToken(
        cardElement,
      );

      axios
        .post(`/api/reservations`, {
          totalPrice,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          source: stripeToken?.id,
          listingId,
        })
        .then(() => {
          toast.success('Listing Reserved🎉');
          setDateRange(initialDateRange);

          router.push('/trips');
        })

        .catch(() => {
          toast.error('something went wrong😢');
        })
        .finally(() => {
          // setIsLoading(false);
        });
    }
  }, [
    totalPrice,
    dateRange,
    listingId,
    loginModal,
    router,
    initialDateRange,
    setDateRange,
  ]);

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading title='Book your Reservation' subtitle='Create an account' />
      <CardElement
        // className='listing-booking-modal__stripe-card'
        options={{ hidePostalCode: true }}
      />
      {/* <Button
        // size="large"
        // type="primary"
        label='Book'
        // className="listing-booking-modal__cta"
        onClick={() => {}}
        // loading={loading}
        disabled={!stripe || !elements}
      /> */}
    </div>
  );

  return (
    <Modal
      disabled={!stripe || !elements}
      isOpen={bookingModal.isOpen}
      title='Book you reservation'
      actionLabel='Reserve'
      onClose={bookingModal.onClose}
      onSubmit={onCreateReservation}
      body={bodyContent}
      // footer={footerContent}
    />
  );
};
export default BookingModal;
