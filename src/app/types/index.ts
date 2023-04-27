import { User, Prisma } from '@prisma/client';

export type SafeUser = Omit<
  User,
  'createdAt' | 'updatedAt' | 'emailVerified'
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

type ListingWithImages = Prisma.ListingGetPayload<{
  include: { images: true | Prisma.ImageFindManyArgs };
}>;

export type SafeListing = Omit<ListingWithImages, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
