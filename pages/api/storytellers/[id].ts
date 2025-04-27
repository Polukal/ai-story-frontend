import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const baseURL = `http://localhost:5050/api/storytellers/${id}`;

  try {
    if (req.method === 'PUT') {
      const form = formidable({ keepExtensions: true });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Form parse error:', err);
          return res.status(400).json({ message: 'Failed to parse form data' });
        }

        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, String(Array.isArray(value) ? value[0] : value));
        });

        if (files.image) {
          const file = Array.isArray(files.image) ? files.image[0] : files.image;
          formData.append(
            'image',
            fs.createReadStream(file.filepath),
            file.originalFilename || 'upload.jpg'
          );
        }

        const response = await axios.put(baseURL, formData, {
          withCredentials: true,
          headers: {
            ...formData.getHeaders(),
            cookie: req.headers.cookie ?? '',
          },
        });

        return res.status(200).json(response.data);
      });

      return;
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
