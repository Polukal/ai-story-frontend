import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const creditTiers = {
  1: { label: "Single Credit", price: 249 },
  3: { label: "Starter Pack", price: 699 },
  10: { label: "Adventurer Pack", price: 2199 },
  25: { label: "Hero Pack", price: 4999 },
  50: { label: "Legend Pack", price: 8999 },
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

    const response = await axios.post(
      "http://localhost:5050/api/payment/create-checkout-session",
      {
        email,
        credits: creditValue,
        label,
        price,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    res.status(200).json({ sessionUrl: response.data.url });
  } catch (error: any) {
    console.error("Flask backend error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
