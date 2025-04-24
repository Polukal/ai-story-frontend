import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const baseURL = `http://localhost:5050/api/storytellers/${id}`;

  try {
    if (req.method === 'PUT') {
      const response = await axios.put(baseURL, req.body, {
        withCredentials: true,
        headers: {
          cookie: req.headers.cookie ?? '',
        },
      });
      return res.status(200).json(response.data);
    }

    if (req.method === 'DELETE') {
      const response = await axios.delete(baseURL, {
        withCredentials: true,
        headers: {
          cookie: req.headers.cookie ?? '',
        },
      });
      return res.status(200).json(response.data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error: any) {
    console.error('Storyteller edit/delete error:', error.response?.data ?? error.message);
    return res.status(error.response?.status ?? 500).json({
      message: error.response?.data?.message ?? 'Edit/Delete failed',
    });
  }
}
