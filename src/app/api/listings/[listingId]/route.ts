import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb'


interface IParams {
    listingId?: string
}

export async function DELETE(request: Request, params: IParams) {
    const { listingId } = params

    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return NextResponse.error()
    }

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid listing ID')
    }

    const listing = await prisma.listing.deleteMany({
        where: {
            id: listingId,
            userId: currentUser.id
        }
    })

    return NextResponse.json(listing)
}