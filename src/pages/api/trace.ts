import type { NextApiRequest, NextApiResponse } from 'next';

type TraceData = {
  fl: string;
  h: string;
  ip: string;
  ts: string;
  visit_scheme: string;
  uag: string;
  colo: string;
  sliver: string;
  http: string;
  loc: string;
  tls: string;
  sni: string;
  warp: string;
  gateway: string;
  rbi: string;
  kex: string;
};

type ResponseData = {
  success: boolean;
  data?: TraceData;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    const response = await fetch('https://popcat.click/cdn-cgi/trace', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://popcat.click/',
        'Origin': 'https://popcat.click',
        'X-Forwarded-For': clientIP as string,
        'CF-Connecting-IP': clientIP as string
      }
    });
    
    const text = await response.text();
    const data = text.split('\n').reduce((acc: TraceData, line: string) => {
      const [key, value] = line.split('=');
      if (key && value) {
        acc[key as keyof TraceData] = value;
      }
      return acc;
    }, {} as TraceData);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching trace:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch trace' 
    });
  }
} 