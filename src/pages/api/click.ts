import { ClickResponse } from '@/api/countries';
import { clickUgandanNuckle } from '@/api/countries';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  success: boolean;
  data?: ClickResponse;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { countryCode, clickCount } = req.body;

    if (!countryCode || typeof clickCount !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request parameters' 
      });
    }

    const result = await clickUgandanNuckle(countryCode, clickCount);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error in click API:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
} 