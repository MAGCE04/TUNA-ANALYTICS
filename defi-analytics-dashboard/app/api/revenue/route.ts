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

// Mock data for revenue
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

  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const baseRevenue = 5000 + Math.floor(i / 10) * 500;
    const randomFactor = 0.3;

    wallets.forEach(wallet => {
      const solAmount = Math.floor(baseRevenue * 0.4 * (1 + (Math.random() * randomFactor - randomFactor / 2)));
      const usdcAmount = Math.floor(baseRevenue * 0.6 * (1 + (Math.random() * randomFactor - randomFactor / 2)));
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
