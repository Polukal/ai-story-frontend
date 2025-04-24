import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const flaskUrl = "http://localhost:5050/api/characters";

  try {
    if (req.method === "GET") {
      const response = await axios.get(flaskUrl, {
        headers: { cookie: req.headers.cookie ?? "" },
        withCredentials: true,
      });
      return res.status(200).json(response.data);
    }

    if (req.method === "POST") {
      const response = await axios.post(flaskUrl, req.body, {
        headers: { cookie: req.headers.cookie ?? "" },
        withCredentials: true,
      });
      return res.status(201).json(response.data);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("Character API Error:", error.response?.data ?? error.message);
    return res.status(error.response?.status ?? 500).json({
      message: error.response?.data?.message ?? "Internal Server Error",
    });
  }
}
