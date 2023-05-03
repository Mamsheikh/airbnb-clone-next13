import stripe from "stripe";

const client = new stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: "2022-11-15",
});

export const Stripe = {
    connect: async (code: string) => {
        const response = await client.oauth.token({
            grant_type: "authorization_code",
            code,
        });

        return response;
    },
    disconnect: async (stripeUserId: string) => {
        const response = await client.oauth.deauthorize({
            client_id: `${process.env.S_CLIENT_ID}`,
            stripe_user_id: stripeUserId,
        });

        return response;
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
