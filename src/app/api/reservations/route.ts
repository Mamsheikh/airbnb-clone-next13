import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { Stripe } from '@/app/libs/stripe';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { listingId, totalPrice, startDate, endDate, source } = body;

  if (!listingId || !totalPrice || !startDate || !endDate) {
    return NextResponse.error();
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId
    }
  })
  if (!listing) {
    throw new Error("No listing found")
  }

  if (listing.userId === currentUser.id) {
    throw new Error("Host can book his own listing")
  }
  const host = await prisma.user.findUnique({
    where: {
      id: listing.userId
    }
  })

  if (!host) {
    throw new Error('Host not found')
  }

  if (!host.walletId) {
    throw new Error("the host is not connected with Stripe");
  }

  await Stripe.charge(totalPrice, source, host.walletId);


  await prisma.user.update({
    where: {
      id: listing.userId
    },
    data: {
      income: { increment: totalPrice }
    }
  })
  const listingAndReservation = await prisma.listing.update({
    where: { id: listingId },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        },
      },
    },
  });

  return NextResponse.json(listingAndReservation);
}
