import { NextResponse } from 'next/server';

export async function GET() {
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
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching trace:', error);
    return NextResponse.json({ error: 'Failed to fetch trace' }, { status: 500 });
  }
} 