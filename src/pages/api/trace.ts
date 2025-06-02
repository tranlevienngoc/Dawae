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
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIP = req.headers['x-real-ip'] || 
                    (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0] : forwardedFor?.[0]) || 
                    req.socket.remoteAddress;
    
    console.log('Client IP:', clientIP);
    console.log('All headers:', req.headers);
    
    let locationData;
    try {
      const locationResponse = await fetch(`https://ipapi.co/${clientIP}/json/`);
      locationData = await locationResponse.json();
      
      if (locationData.error) {
        console.warn('Location API error:', locationData);
        locationData = { country_code: 'VN' }; // Fallback to Vietnam
      }
    } catch (locationError) {
      console.error('Error fetching location:', locationError);
      locationData = { country_code: 'VN' }; // Fallback to Vietnam
    }
    
    console.log('Location data:', locationData);
    
    const data: TraceData = {
      fl: "740f138",
      h: "popcat.click",
      ip: clientIP as string,
      ts: Date.now().toString(),
      visit_scheme: "https",
      uag: req.headers['user-agent'] as string || "",
      colo: locationData.country_code || "VN",
      sliver: "none",
      http: "http/2",
      loc: locationData.country_code || "VN",
      tls: "TLSv1.3",
      sni: "encrypted",
      warp: "off",
      gateway: "off",
      rbi: "off",
      kex: "X25519MLKEM768"
    };

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching trace:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch trace' 
    });
  }
} 