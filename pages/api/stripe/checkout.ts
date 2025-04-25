import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const creditTiers = {
  5:   { label: "Starter Pack", price: 199 },
  15:  { label: "Adventurer Pack", price: 499 },
  30:  { label: "Hero Pack", price: 899 },
  60:  { label: "Legend Pack", price: 1499 },
  120: { label: "Mega Pack", price: 2499 },
} as const;

type CreditAmount = keyof typeof creditTiers;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, credits } = req.body;
    const creditValue = parseInt(credits, 10) as CreditAmount;

    if (!email || !creditTiers[creditValue]) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const { label, price } = creditTiers[creditValue];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${label} (${creditValue} Credits)`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        credits: String(creditValue),
        customer_email: email,
      },
      customer_email: email,
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ sessionUrl: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
}
