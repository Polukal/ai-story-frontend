import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.post('http://localhost:5050/api/generate_image', req.body, {
      withCredentials: true,
      headers: {
        cookie: req.headers.cookie || '',
      },
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Image generation error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Image generation failed',
    });
  }
}
