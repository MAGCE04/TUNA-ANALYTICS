import { NextResponse } from 'next/server';
import { RevenueData, PeriodType } from '../../types';

// Generate random Solana wallet address
const generateWalletAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Mock data for revenue with dynamic growth pattern
const generateRevenueData = () => {
  const data: RevenueData[] = [];
  const now = Date.now();

  const wallets = [
    generateWalletAddress(),
    generateWalletAddress(),
    generateWalletAddress(),
    generateWalletAddress(),
    generateWalletAddress()
  ];

  // Protocol start date: September 15, 2023
  const startDate = new Date(2023, 8, 15);
  const startTimestamp = startDate.getTime();
  
  // Calculate days since protocol start
  const daysSinceStart = Math.floor((now - startTimestamp) / (1000 * 60 * 60 * 24));
  
  // Generate data only from protocol start date
  for (let i = daysSinceStart; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Skip dates before protocol start
    if (date.getTime() < startTimestamp) continue;
    
    // Dynamic growth model: slow start, accelerated growth, then stabilization
    // This creates a more realistic revenue pattern
    let growthFactor = 1.0;
    if (i > daysSinceStart - 15) {
      // First 15 days: slow start
      growthFactor = 0.3 + ((daysSinceStart - i) / 15) * 0.7;
    } else if (i > daysSinceStart - 45) {
      // Next 30 days: accelerated growth
      growthFactor = 1.0 + ((daysSinceStart - 15 - i) / 30) * 1.5;
    } else {
      // Later days: stabilization with fluctuations
      growthFactor = 2.5 + Math.sin(i * 0.2) * 0.5;
    }
    
    // Weekend boost
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      growthFactor *= 1.2; // 20% boost on weekends
    }
    
    // Base revenue that grows over time
    const baseRevenue = 5000 + Math.floor((daysSinceStart - i) / 5) * 500;
    const randomFactor = 0.3;

    wallets.forEach(wallet => {
      const solAmount = Math.floor(baseRevenue * 0.4 * growthFactor * (1 + (Math.random() * randomFactor - randomFactor / 2)));
      const usdcAmount = Math.floor(baseRevenue * 0.6 * growthFactor * (1 + (Math.random() * randomFactor - randomFactor / 2)));
      const totalUsdValue = solAmount * 100 + usdcAmount;

      data.push({
        timestamp: date.getTime(),
        wallet,
        solAmount,
        usdcAmount,
        totalUsdValue,
        periodType: PeriodType.Daily
      });
    });
  }

  return data;
};

// ✅ Responder datos con headers CORS
export async function GET() {
  const revenueData = generateRevenueData();

  return new NextResponse(JSON.stringify(revenueData), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // o 'https://tunaiq.com' en producción
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// ✅ Manejar preflight request (CORS OPTIONS)
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