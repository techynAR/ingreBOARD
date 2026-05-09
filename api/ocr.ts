import type { VercelRequest, VercelResponse } from '@vercel/node';

const allowCors = (fn: any) => async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { base64Image } = req.body;
        const apiKey = process.env.OCR_SPACE_API_KEY || process.env.VITE_OCR_SPACE_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'OCR API key not configured' });
        }

        if (!base64Image) {
            return res.status(400).json({ error: 'Missing base64Image in request body' });
        }

        const formData = new URLSearchParams();
        formData.append('base64Image', base64Image);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('scale', 'true');
        formData.append('OCREngine', '2');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const ocrRes = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString(),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!ocrRes.ok) {
            throw new Error(`OCR API responded with status: ${ocrRes.statusText}`);
        }

        const data = await ocrRes.json();
        return res.status(200).json(data);
    } catch (error: any) {
        console.error('OCR backend error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

export default allowCors(handler);
