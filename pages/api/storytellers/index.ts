import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseURL = 'http://localhost:5050/api/storytellers';

  try {
    if (req.method === 'GET') {
      const response = await axios.get(baseURL, {
        withCredentials: true,
        headers: {
          cookie: req.headers.cookie ?? '',
        },
      });
      return res.status(200).json(response.data);
    }

    if (req.method === 'POST') {
      const response = await axios.post(baseURL, req.body, {
        withCredentials: true,
        headers: {
          cookie: req.headers.cookie ?? '',
        },
      });
      return res.status(200).json(response.data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error: any) {
    console.error('Storyteller error:', error.response?.data ?? error.message);
    return res.status(error.response?.status ?? 500).json({
      message: error.response?.data?.message ?? 'Storyteller operation failed',
    });
  }
}
