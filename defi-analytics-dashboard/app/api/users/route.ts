import { NextResponse } from 'next/server';

// Mock data for user activity
const generateUserActivityData = () => {
  const data = [];
  const now = new Date();
  
  // Generate data for the last 90 days
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Base values with some randomization
    const baseUsers = 1000 + Math.floor(i / 10) * 100; // Gradually increasing trend
    const randomFactor = 0.2; // 20% random variation
    
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

export async function GET() {
  // Generate mock data
  const userData = generateUserActivityData();
  
  return NextResponse.json(userData);
}