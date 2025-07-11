import { NextResponse } from 'next/server';

// Mock data for user activity
const generateUserActivityData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);

    const baseUsers = 1000 + Math.floor(i / 10) * 100;
    const randomFactor = 0.2;
    
    const uniqueUsers = Math.floor(baseUsers * (1 + (Math.random() * randomFactor - randomFactor/2)));
    const newUsers = Math.floor(uniqueUsers * 0.15 * (1 + (Math.random() * randomFactor - randomFactor/2)));
    const returningUsers = uniqueUsers - newUsers;
    const totalTransactions = Math.floor(uniqueUsers * 3.5 * (1 + (Math.random() * randomFactor - randomFactor/2)));
    
    data.push({
      date: date.toISOString().split('T')[0],
      uniqueUsers,
      newUsers,
      returningUsers,
      totalTransactions,
      timestamp: date.getTime()
    });
  }

  return data;
};

// ✅ GET con headers CORS
export async function GET() {
  const userData = generateUserActivityData();

  return new NextResponse(JSON.stringify(userData), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // O cámbialo a 'https://tunaiq.com'
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// ✅ OPTIONS para preflight request
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
