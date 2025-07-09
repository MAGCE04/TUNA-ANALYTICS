// script.js

// API endpoints
const API_ENDPOINTS = {
  revenue: 'https://api.defituna.com/revenue',
  liquidations: 'https://api.defituna.com/liquidations',
  orders: 'https://api.defituna.com/orders',
  pools: 'https://api.defituna.com/pools',
  users: 'https://api.defituna.com/users',
  wallets: 'https://api.defituna.com/wallets'
};

// Mock data for fallback if API is unavailable
const MOCK_DATA = {
  revenue: {
    totalRevenue: 1250000,
    totalVolume: 318000,
    averageDailyRevenue: 4250,
    sevenDayAverage: 5750,
    dailyGrowthPercentage: 5.2,
    dailyRevenue: [
      { date: '2023-11-01', totalUsdValue: 42000 },
      { date: '2023-11-02', totalUsdValue: 45000 },
      { date: '2023-11-03', totalUsdValue: 48000 },
      { date: '2023-11-04', totalUsdValue: 51000 },
      { date: '2023-11-05', totalUsdValue: 55000 },
      { date: '2023-11-06', totalUsdValue: 60000 },
      { date: '2023-11-07', totalUsdValue: 65000 }
    ],
    walletRevenue: [
      { wallet: 'wallet1', label: 'Wallet 1', solAmount: 1250, usdcAmount: 45000, totalUsdValue: 125000, percentage: 42.5 },
      { wallet: 'wallet2', label: 'Wallet 2', solAmount: 850, usdcAmount: 32000, totalUsdValue: 85000, percentage: 28.9 },
      { wallet: 'wallet3', label: 'Wallet 3', solAmount: 620, usdcAmount: 25000, totalUsdValue: 62000, percentage: 21.1 },
      { wallet: 'wallet4', label: 'Wallet 4', solAmount: 220, usdcAmount: 12000, totalUsdValue: 22000, percentage: 7.5 }
    ]
  },
  users: {
    totalUsers: 421,
    activeUsers: [12, 19, 3, 5, 2, 3, 7]
  },
  assets: {
    trackedAssets: 87
  }
};

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Format percentage
function formatPercentage(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

// Format SOL
function formatSol(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value) + ' SOL';
}

// Format USDC
function formatUsdc(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value) + ' USDC';
}

// Fetch data from API with fallback to mock data
async function fetchData(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Error fetching data from ${endpoint}:`, error);
    // Return corresponding mock data based on endpoint
    const endpointKey = Object.keys(API_ENDPOINTS).find(key => API_ENDPOINTS[key] === endpoint);
    return MOCK_DATA[endpointKey] || null;
  }
}

// Update dashboard with fetched data
async function updateDashboard() {
  try {
    // Show loading state
    document.getElementById('loading-indicator').classList.remove('hidden');
    
    // Fetch data from endpoints
    const revenueData = await fetchData(API_ENDPOINTS.revenue) || MOCK_DATA.revenue;
    const usersData = await fetchData(API_ENDPOINTS.users) || MOCK_DATA.users;
    const assetsData = await fetchData(API_ENDPOINTS.wallets) || MOCK_DATA.assets;
    
    // Update UI with data
    document.getElementById("total-users").textContent = usersData.totalUsers || "421";
    document.getElementById("total-volume").textContent = formatCurrency(revenueData.totalVolume || 318000);
    document.getElementById("tracked-assets").textContent = assetsData.trackedAssets || "87";
    document.getElementById("total-revenue").textContent = formatCurrency(revenueData.totalRevenue || 1250000);
    
    // Update metrics
    document.getElementById('average-daily').textContent = formatCurrency(revenueData.averageDailyRevenue || 4250);
    document.getElementById('seven-day-average').textContent = formatCurrency(revenueData.sevenDayAverage || 5750);
    
    const growthElement = document.getElementById('daily-growth');
    const growthTrend = (revenueData.dailyGrowthPercentage || 5.2) >= 0 ? 'up' : 'down';
    const growthClass = (revenueData.dailyGrowthPercentage || 5.2) >= 0 ? 'positive' : 'negative';
    
    growthElement.textContent = formatPercentage(Math.abs(revenueData.dailyGrowthPercentage || 5.2));
    document.getElementById('growth-direction').textContent = growthTrend === 'up' ? '↑' : '↓';
    document.getElementById('growth-direction').parentElement.className = `growth ${growthClass}`;
    
    // Update wallet table
    const tableBody = document.getElementById('wallet-table-body');
    tableBody.innerHTML = '';
    
    if (revenueData.walletRevenue && revenueData.walletRevenue.length > 0) {
      revenueData.walletRevenue.forEach(wallet => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${wallet.label || wallet.wallet.substring(0, 8) + '...'}</td>
          <td>${formatSol(wallet.solAmount)}</td>
          <td>${formatUsdc(wallet.usdcAmount)}</td>
          <td>${formatCurrency(wallet.totalUsdValue)}</td>
          <td><span class="badge badge-success">${formatPercentage(wallet.percentage)}</span></td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td colspan="5" style="text-align: center; color: #aaa;">
          No wallet data available
        </td>
      `;
      tableBody.appendChild(row);
    }
    
    // Draw chart with data
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    // Clear any existing chart
    if (window.activityChart) {
      window.activityChart.destroy();
    }
    
    // Prepare chart data
    const labels = revenueData.dailyRevenue ? revenueData.dailyRevenue.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    const values = revenueData.dailyRevenue ? 
      revenueData.dailyRevenue.map(item => item.totalUsdValue) : 
      usersData.activeUsers || [12, 19, 3, 5, 2, 3, 7];
    
    // Create new chart
    window.activityChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Daily Revenue',
          data: values,
          borderColor: '#00ffcc',
          backgroundColor: 'rgba(0, 255, 204, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#aaa',
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#aaa'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#f0f0f0'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Revenue: ' + formatCurrency(context.raw);
              }
            }
          }
        }
      }
    });
    
    // Update last updated time
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })} ${now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
    
    document.getElementById('last-updated').textContent = formattedDate;
    document.getElementById('current-year').textContent = now.getFullYear();
    
  } catch (error) {
    console.error('Error updating dashboard:', error);
    
    // Fallback to mock data if there's an error
    document.getElementById("total-users").textContent = "421";
    document.getElementById("total-volume").textContent = "$318,000";
    document.getElementById("tracked-assets").textContent = "87";
    document.getElementById("total-revenue").textContent = "$1,250,000";
    document.getElementById('average-daily').textContent = "$4,250";
    document.getElementById('seven-day-average').textContent = "$5,750";
    document.getElementById('daily-growth').textContent = "5.2%";
    
  } finally {
    // Hide loading indicator
    document.getElementById('loading-indicator').classList.add('hidden');
  }
}

// Handle time filter buttons
function setupTimeFilterButtons() {
  const timeButtons = document.querySelectorAll('.time-btn');
  timeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      timeButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // In a real app, this would trigger data refresh with different time range
      console.log(`Time range changed to: ${this.dataset.range}`);
      
      // For demo purposes, refresh the dashboard
      updateDashboard();
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Initial data fetch
  updateDashboard();
  
  // Setup time filter buttons
  setupTimeFilterButtons();
  
  // Set up hourly data refresh
  setInterval(updateDashboard, 60 * 60 * 1000); // 1 hour in milliseconds
});