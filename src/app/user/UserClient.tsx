'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Container from '../components/Container';
import Avatar from '../components/Avatar';
import { SafeUser } from '../types';
import Heading from '../components/Heading';
import { hr } from 'date-fns/locale';
import Button from '../components/Button';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UserClientProps {
  currentUser?: SafeUser | null;
}

const UserClient: React.FC<UserClientProps> = ({ currentUser }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get('code');

  useEffect(() => {
    if (code) {
      axios
        .post(`/api/stripe`, {
          code,
        })
        .then(() => {
          toast.success('Stripe connected');
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {});
    }
  }, [code, router]);

  const stripeUrl = `https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID}&scope=read_write&redirect_uri=http://localhost:3000/user`;
  return (
    <Container>
      <div className='max-w-sm h-full mx-auto border shadow-md px-4 py-3'>
        <div className='flex items center justify-center mb-4'>
          <Avatar src={currentUser?.image} size='lg' />
        </div>
        <hr />
        <div className='my-6'>
          <Heading title='Details' />

          <div className='flex space-y-3 flex-col font-light'>
            <div>
              Name: <span className='font-semibold'>{currentUser?.name}</span>
            </div>
            <div>
              Email: <span className='font-semibold'>{currentUser?.email}</span>
            </div>
          </div>
        </div>
        {currentUser && (
          <>
            <hr />
            <div className='my-6 space-y-4 font-light'>
              <Heading
                title='Additional Details'
                subtitle='Interested in becoming a Groundbnb host? Register with your Stripe account!'
              />

              <Button
                label='Connect with Stripe'
                onClick={() => router.push(stripeUrl)}
              />

              <div className='text-xs text-neutral-500 '>
                When redirected to the Stripe account activation form, click the{' '}
                <span className='font-semibold'>Skip this account form</span>{' '}
                link presented at the top to connect with Stripe in development
                mode.
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default UserClient;
