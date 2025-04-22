import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await axios.post("http://localhost:5050/api/auth/logout", {}, {
      withCredentials: true,
      headers: {
        cookie: req.headers.cookie ?? "",
      },
    });

    // Forward any cookies that should be cleared
    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    return res.status(200).json(response.data);
  } catch (err: any) {
    return res.status(err.response?.status ?? 500).json({
      message: err.response?.data?.message ?? "Logout failed",
    });
  }
}
