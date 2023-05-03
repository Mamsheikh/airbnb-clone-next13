import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { Stripe } from "@/app/libs/stripe";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { code } = body;
        console.log(code)

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.error()
        }

        const wallet = await Stripe.connect(code)

        if (!wallet) {
            throw new Error("stripe grant error");
        }

        const user = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                walletId: wallet.stripe_user_id
            }
        })

        return NextResponse.json(user)
    } catch (error: any) {
        throw new Error(error)
    }


}