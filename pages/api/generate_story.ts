import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.post('http://localhost:5050/api/generate_story', req.body, {
      withCredentials: true,
      headers: {
        cookie: req.headers.cookie || '',
      },
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Story generation error:', error.response?.data || error.message);
  
    const status = error.response?.status || 500;
    const data = error.response?.data || {};
  
    return res.status(status).json({
      error: data.error || data.message || 'Story generation failed',
    });
  }
}
