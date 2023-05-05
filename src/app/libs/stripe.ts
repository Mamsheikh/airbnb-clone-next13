import stripe from "stripe";
import { SafeUser } from "../types";

const client = new stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: "2022-11-15",
});

export const Stripe = {
    connect: async (currentUser: SafeUser) => {
        // const response = await client.oauth.token({
        //     grant_type: "authorization_code",
        //     code,
        // });

        const nameArray = currentUser.name!.split(" ");
        const first_name = nameArray[0];
        const last_name = nameArray.length > 1 ? nameArray.slice(1).join(" ") : "";
        const url = `https://www.${currentUser.name!.replace(/\s+/g, "-").toLowerCase()}.com`;


        const accountParams = await client.accounts.create({
            type: 'express',
            email: currentUser.email!,
            business_type: 'individual',
            country: undefined,

            business_profile: {
                url,

            },
            individual: {
                first_name,
                last_name,
                email: currentUser.email!,


            }
        })

        const accountId = accountParams.id
        const isProd = process.env.NODE_ENV === 'production';
        const refresh_url = isProd ? 'https://groundbnb.vercel.app' : 'http://localhost:3000/user';
        const return_url = isProd ? 'https://groundbnb.vercel.app' : 'http://localhost:3000/user';
        // Create an account link for the user's Stripe account
        const accountLink = await client.accountLinks.create({
            account: accountId,
            refresh_url,
            return_url,
            type: 'account_onboarding',
        });
        accountLink.url
        return { accountId, accountLink };
    },
    balance: async (stripeAccount: string,) => {
        const balance = await client.balance.retrieve({
            stripeAccount
        });

        return balance.available[0].amount

    },
    disconnect: async (stripeUserId: string) => {
        const response = await client.accounts.del(stripeUserId)

        return response
    },
    charge: async (amount: number, source: string, stripeAccount: string) => {
        try {
            const res = await client.charges.create(
                {
                    amount, // Amount intended to be collected (in the smallest currency unit, $1.00 => 100)
                    currency: "usd",
                    source, // Payment source to be charged (tenant)
                    application_fee_amount: Math.round(amount * 0.05), // 5% app fee (rounded to the nearest integer)
                },
                {
                    stripeAccount: stripeAccount, // Account that is going to receive the payment (host)
                }
            );

            if (res.status !== "succeeded") {
                throw new Error("failed to create charge with Stripe");
            }
        } catch (error) {
            throw new Error(error as string);
        }
    },
};
