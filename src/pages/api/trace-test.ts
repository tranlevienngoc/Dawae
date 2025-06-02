import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  success: boolean;
  data?: string ;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://popcat.click/cdn-cgi/trace', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://popcat.click/',
        'Origin': 'https://popcat.click'
      }
    });
    
    const data = await response.text();

    console.log(data, 'data123');
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error('Error in click API:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
} 
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     const response = await fetch('https://popcat.click/cdn-cgi/trace', {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Referer': 'https://popcat.click/',
//         'Origin': 'https://popcat.click'
//       }
//     });
    
//     const data = await response.text();
//     return NextResponse.json({ data });
//   } catch (error) {
//     console.error('Error fetching trace:', error);
//     return NextResponse.json({ error: 'Failed to fetch trace' }, { status: 500 });
//   }
// } 