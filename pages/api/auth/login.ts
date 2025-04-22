import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const backendRes = await axios.post("http://localhost:5050/api/auth/login", req.body, {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie ?? "",
      },
    });

    // Forward the set-cookie header to the client
    const cookies = backendRes.headers["set-cookie"];
    if (cookies) {
      res.setHeader("Set-Cookie", cookies);
    }

    return res.status(200).json(backendRes.data);
  } catch (err: any) {
    return res.status(err.response?.status ?? 500).json({ error: "Login failed" });
  }
}
