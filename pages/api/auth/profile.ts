import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await axios.get("http://localhost:5050/api/auth/profile", {
      withCredentials: true,
      headers: {
        cookie: req.headers.cookie ?? "",
      },
    });

    return res.status(200).json(response.data);
  } catch (err: any) {
    return res.status(err.response?.status ?? 500).json({
      message: err.response?.data?.message ?? "Fetching profile failed",
    });
  }
}
