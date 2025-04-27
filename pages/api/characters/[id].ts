import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const flaskUrl = `http://localhost:5050/api/characters/${id}`;

  try {
    if (req.method === "PUT") {
      const form = formidable({ keepExtensions: true });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          return res.status(400).json({ message: "Failed to parse form data" });
        }

        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, String(Array.isArray(value) ? value[0] : value));
        });

        if (files.image) {
          const file = Array.isArray(files.image) ? files.image[0] : files.image;
          formData.append(
            "image",
            fs.createReadStream(file.filepath),
            file.originalFilename || "upload.jpg"
          );
        }

        const response = await axios.put(flaskUrl, formData, {
          headers: {
            ...formData.getHeaders(),
            cookie: req.headers.cookie ?? "",
          },
          withCredentials: true,
        });

        return res.status(200).json(response.data);
      });

      return;
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
