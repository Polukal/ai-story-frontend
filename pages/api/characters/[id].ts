import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const flaskUrl = `http://localhost:5050/api/characters/${id}`;

  try {
    if (req.method === "PUT") {
      const response = await axios.put(flaskUrl, req.body, {
        headers: { cookie: req.headers.cookie ?? "" },
        withCredentials: true,
      });
      return res.status(200).json(response.data);
    }

    if (req.method === "DELETE") {
      const response = await axios.delete(flaskUrl, {
        headers: { cookie: req.headers.cookie ?? "" },
        withCredentials: true,
      });
      return res.status(200).json(response.data);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("Character API Error:", error.response?.data ?? error.message);
    return res.status(error.response?.status ?? 500).json({
      message: error.response?.data?.message ?? "Internal Server Error",
    });
  }
}
