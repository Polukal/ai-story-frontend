import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await axios.post("http://localhost:5050/api/auth/register", req.body, {
      withCredentials: true,
    });

    // Forward cookie if any (you can set cookies manually if needed)
    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    return res.status(201).json(response.data);
  } catch (err: any) {
    return res.status(err.response?.status ?? 500).json({
      message: err.response?.data?.message ?? "Registration failed",
    });
  }
}
