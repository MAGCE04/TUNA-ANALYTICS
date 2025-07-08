import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { UserActivity, UserMetrics } from '@/app/types';
import { subDays, subMonths, format } from 'date-fns';

// Constants
const TUNA_API_BASE = 'https://api.defituna.com'; // Replace with actual DeFi Tuna API endpoint
const TUNA_PROGRAM_ID = 'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD';

// Fetch user activity data directly from DeFi Tuna API
const fetchUserActivity = async (
  startTimestamp: number,
  endTimestamp: number
): Promise<UserActivity[]> => {
  try {
    // Call DeFi Tuna's users API endpoint
    const response = await axios.get(`${TUNA_API_BASE}/users/activity`, {
      params: {
        startTime: startTimestamp,
        endTime: endTimestamp
      }
    });
    
    const userActivity: UserActivity[] = [];
    
    // Process the response data
    if (response.data && Array.isArray(response.data)) {
      for (const item of response.data) {
        userActivity.push({
          date: item.date,
          uniqueUsers: item.uniqueUsers || 0,
          newUsers: item.newUsers || 0,
          returningUsers: item.returningUsers || 0,
          totalTransactions: item.totalTransactions || 0,
        });
      }
    }
    
    return userActivity;
  } catch (error) {
    console.error('Error fetching user activity from DeFi Tuna API:', error);
    return [];
  }
};

// Fetch user metrics directly from DeFi Tuna API
const fetchUserMetrics = async (): Promise<UserMetrics> => {
  try {
    // Call DeFi Tuna's users metrics API endpoint
    const response = await axios.get(`${TUNA_API_BASE}/users/metrics`);
    
    if (response.data) {
      return {
        dau: response.data.dau || 0,
        wau: response.data.wau || 0,
        mau: response.data.mau || 0,
        retentionRate: response.data.retentionRate || 0,
        averageTransactionsPerUser: response.data.averageTransactionsPerUser || 0,
      };
    }
    
    return {
      dau: 0,
      wau: 0,
      mau: 0,
      retentionRate: 0,
      averageTransactionsPerUser: 0,
    };
  } catch (error) {
    console.error('Error fetching user metrics from DeFi Tuna API:', error);
    return {
      dau: 0,
      wau: 0,
      mau: 0,
      retentionRate: 0,
      averageTransactionsPerUser: 0,
    };
  }
};

// Calculate user metrics from activity data
const calculateUserMetrics = (activities: UserActivity[]): UserMetrics => {
  // Get the most recent activities
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate DAU (most recent day)
  const dau = sortedActivities.length > 0 ? sortedActivities[0].uniqueUsers : 0;
  
  // Calculate WAU (last 7 days)
  const last7Days = sortedActivities.slice(0, 7);
  const wau = last7Days.reduce((sum, day) => sum + day.uniqueUsers, 0) / last7Days.length;
  
  // Calculate MAU (last 30 days)
  const last30Days = sortedActivities.slice(0, 30);
  const mau = last30Days.reduce((sum, day) => sum + day.uniqueUsers, 0) / last30Days.length;
  
  // Calculate retention rate
  const totalUsers = activities.reduce((sum, day) => sum + day.uniqueUsers, 0);
  const totalReturningUsers = activities.reduce((sum, day) => sum + day.returningUsers, 0);
  const retentionRate = totalUsers > 0 ? (totalReturningUsers / totalUsers) * 100 : 0;
  
  // Calculate average transactions per user
  const totalTransactions = activities.reduce((sum, day) => sum + day.totalTransactions, 0);
  const averageTransactionsPerUser = totalUsers > 0 ? totalTransactions / totalUsers : 0;
  
  return {
    dau,
    wau,
    mau,
    retentionRate,
    averageTransactionsPerUser,
  };
};

// Generate mock user activity data for development
const generateMockUserActivity = (days = 30): UserActivity[] => {
  const mockData: UserActivity[] = [];
  const now = new Date();
  
  // Create a trend with some randomness
  let baseUsers = 100 + Math.floor(Math.random() * 50);
  let growthFactor = 1.01 + Math.random() * 0.02; // 1-3% daily growth
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Add some randomness to the user count
    const dailyRandomFactor = 0.9 + Math.random() * 0.2; // 90-110% of expected
    const uniqueUsers = Math.floor(baseUsers * dailyRandomFactor);
    
    // New vs returning split (30-40% new)
    const newUserPercentage = 0.3 + Math.random() * 0.1;
    const newUsers = Math.floor(uniqueUsers * newUserPercentage);
    const returningUsers = uniqueUsers - newUsers;
    
    // Transactions (2-5 per user on average)
    const transactionsPerUser = 2 + Math.random() * 3;
    const totalTransactions = Math.floor(uniqueUsers * transactionsPerUser);
    
    mockData.push({
      date: dateStr,
      uniqueUsers,
      newUsers,
      returningUsers,
      totalTransactions,
    });
    
    // Update base for next day (going backward in time)
    baseUsers = baseUsers / growthFactor;
  }
  
  // Sort by date ascending
  return mockData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  const startTimestamp = startDate 
    ? new Date(startDate).getTime() / 1000 
    : subDays(new Date(), 30).getTime() / 1000;
    
  const endTimestamp = endDate 
    ? new Date(endDate).getTime() / 1000 
    : new Date().getTime() / 1000;
  
  try {
    let userActivity: UserActivity[] = [];
    let metrics: UserMetrics;
    
    if (process.env.NODE_ENV === 'production') {
      // Fetch user activity and metrics from DeFi Tuna API
      userActivity = await fetchUserActivity(startTimestamp, endTimestamp);
      metrics = await fetchUserMetrics();
    } else {
      // Use mock data for development
      console.log('Using mock user activity data');
      userActivity = generateMockUserActivity(30);
      metrics = calculateUserMetrics(userActivity);
    }
    
    return NextResponse.json({ 
      activity: userActivity,
      metrics
    });
  } catch (error) {
    console.error('Error processing user activity data:', error);
    return NextResponse.json({ error: 'Failed to fetch user activity data' }, { status: 500 });
  }
}