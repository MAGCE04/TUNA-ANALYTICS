import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Utility functions
const formatCurrency = (value) => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

const formatSol = (value) => {
  return `◎${value.toFixed(2)}`;
};

// Mock data for demonstration
const generateMockData = () => {
  // Revenue data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 75000, 85000, 90000, 100000, 120000, 130000, 140000, 150000, 160000, 170000, 180000],
        borderColor: '#00e4ff',
        backgroundColor: 'rgba(0, 228, 255, 0.1)',
        fill: true,
      },
    ],
  };

  // User growth data
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Users',
        data: [5000, 7500, 10000, 12500, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000],
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
      },
    ],
  };

  // Asset allocation data
  const assetAllocationData = {
    labels: ['SOL', 'USDC', 'ETH', 'BTC', 'Other'],
    datasets: [
      {
        label: 'Asset Allocation',
        data: [40, 30, 15, 10, 5],
        backgroundColor: [
          '#00e4ff',
          '#9333ea',
          '#00ffa3',
          '#ffb300',
          '#ff4d6d',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Trading volume data
  const tradingVolumeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Trading Volume',
        data: [1200000, 1500000, 1800000, 2000000, 2200000, 2500000, 2800000, 3000000, 3200000, 3500000, 3800000, 4000000],
        backgroundColor: '#00ffa3',
      },
    ],
  };

  return {
    revenueData,
    userGrowthData,
    assetAllocationData,
    tradingVolumeData,
    metrics: {
      totalRevenue: 1500000,
      dailyRevenue: 50000,
      totalUsers: 50000,
      activeUsers: 15000,
      totalTVL: 320000000,
      dailyVolume: 12000000,
      protocolAge: 180,
      growthRate: 15.3,
    }
  };
};

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // For now, we'll use mock data
    const mockData = generateMockData();
    setData(mockData);
    setLoading(false);
    
    // Trigger animation after component mounts
    setAnimate(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">🐟</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <Head>
        <title>DeFi Tuna Analytics Dashboard</title>
        <meta name="description" content="Analytics dashboard for DeFi Tuna on Solana" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              {/* Logo */}
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-md"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🐟</span>
                </div>
              </div>
              <span className="text-xl font-bold gradient-text">DeFi Tuna Analytics</span>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-success mr-2 pulse"></div>
                <span className="text-sm text-text-muted">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className={`transition-all duration-1000 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="gradient-text">DeFi Tuna Dashboard</span> 
                <span className="ml-2">🐟</span>
              </h1>
              <p className="text-text-muted">
                Last updated: {format(new Date(), 'MMM d, yyyy HH:mm')} • 
                <span className="ml-1">Protocol analytics at a glance</span>
              </p>
            </div>
          </div>
        </div>

        {/* Protocol Overview Boxes */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="text-primary text-xl mr-2">📊</span> Protocol Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overview Box 1: Protocol Status */}
            <div className="card bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Protocol Status</h3>
                  <p className="text-sm text-text-muted">Operational since {format(new Date(Date.now() - data.metrics.protocolAge * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Status</span>
                  <span className="font-bold flex items-center">
                    <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></span>
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Uptime</span>
                  <span className="font-bold">{data.metrics.protocolAge} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Last Update</span>
                  <span className="font-bold">{format(new Date(), 'MMM d, HH:mm')}</span>
                </div>
              </div>
            </div>

            {/* Overview Box 2: Key Metrics */}
            <div className="card bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Key Metrics</h3>
                  <p className="text-sm text-text-muted">Current performance indicators</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Total TVL</span>
                  <span className="font-bold">{formatCurrency(data.metrics.totalTVL)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Daily Volume</span>
                  <span className="font-bold">{formatCurrency(data.metrics.dailyVolume)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Active Users</span>
                  <span className="font-bold">{data.metrics.activeUsers.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Overview Box 3: Growth Indicators */}
            <div className="card bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Growth Indicators</h3>
                  <p className="text-sm text-text-muted">Period-over-period changes</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Revenue Growth</span>
                  <span className="font-bold text-success">
                    📈 {formatPercentage(12.5)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">User Growth</span>
                  <span className="font-bold text-success">
                    📈 {formatPercentage(18.7)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Retention Rate</span>
                  <span className="font-bold">{formatPercentage(85.2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: REVENUE OVERVIEW */}
        <div className="mb-10 border-b border-border pb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="text-primary text-xl mr-2">💰</span> Revenue Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Revenue Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Total Revenue in SOL</span>
                  <span className="font-bold">{formatSol(data.metrics.totalRevenue / 20)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Total Revenue in USD</span>
                  <span className="font-bold">{formatCurrency(data.metrics.totalRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Daily Avg. Revenue</span>
                  <span className="font-bold">{formatCurrency(data.metrics.dailyRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Growth Rate</span>
                  <span className="font-bold text-success">
                    📈 {formatPercentage(12.5)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Revenue per User</span>
                  <span className="font-bold">
                    {formatCurrency(data.metrics.totalRevenue / data.metrics.totalUsers)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 card">
              <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
              <div className="h-64">
                <Line 
                  data={data.revenueData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: USER OVERVIEW */}
        <div className="mb-10 border-b border-border pb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="text-primary text-xl mr-2">👥</span> User Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-lg font-bold mb-4">User Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Total Users</span>
                  <span className="font-bold">{data.metrics.totalUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Active Users</span>
                  <span className="font-bold">{data.metrics.activeUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">New Users (Last 30 Days)</span>
                  <span className="font-bold">{Math.round(data.metrics.totalUsers * 0.15).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Retention Rate</span>
                  <span className="font-bold">{formatPercentage(85.2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">User Growth Rate</span>
                  <span className="font-bold">{formatPercentage(18.7)}</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 card">
              <h3 className="text-lg font-bold mb-4">User Growth Trend</h3>
              <div className="h-64">
                <Line 
                  data={data.userGrowthData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: ASSET ALLOCATION */}
        <div className="mb-10 border-b border-border pb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="text-primary text-xl mr-2">🔄</span> Asset Allocation
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Asset Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Total Assets Tracked</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Most Popular Asset</span>
                  <span className="font-bold">SOL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Highest APY Asset</span>
                  <span className="font-bold">BTC (6.8%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Stablecoin Ratio</span>
                  <span className="font-bold">{formatPercentage(30)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Asset Diversity Score</span>
                  <span className="font-bold">7.5/10</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 card">
              <h3 className="text-lg font-bold mb-4">Asset Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <div style={{ width: '80%', height: '100%' }}>
                  <Pie 
                    data={data.assetAllocationData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            color: 'rgba(255, 255, 255, 0.7)',
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: TRADING VOLUME */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="text-primary text-xl mr-2">📉</span> Trading Volume
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Trading Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Total Trading Volume</span>
                  <span className="font-bold">{formatCurrency(data.tradingVolumeData.datasets[0].data.reduce((a, b) => a + b, 0))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Daily Avg. Volume</span>
                  <span className="font-bold">{formatCurrency(data.metrics.dailyVolume)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Largest Trade</span>
                  <span className="font-bold">{formatCurrency(500000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Trade Count</span>
                  <span className="font-bold">125,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Avg. Trade Size</span>
                  <span className="font-bold">{formatCurrency(8500)}</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 card">
              <h3 className="text-lg font-bold mb-4">Trading Volume Trend</h3>
              <div className="h-64">
                <Bar 
                  data={data.tradingVolumeData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-md border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-text-muted mb-2">
              Data updates every 12 hours. Last updated displayed on each page.
            </p>
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} DeFi Tuna Analytics • 
              <span className="ml-1">Built with 🐟 on Solana</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}