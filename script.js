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
    sevenDayRevenue: 42500,
    oneMonthRevenue: 156000,
    allTimeRevenue: 1250000,
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
    activeUsers: {
      '7d': [12, 19, 3, 5, 2, 3, 7],
      '1m': [5, 7, 10, 12, 15, 18, 22, 19, 17, 14, 12, 10, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25, 22, 20, 18, 16, 14, 12, 10, 8],
      '3m': [10, 15, 20, 25, 30, 25, 20, 15, 10, 15, 20, 25, 30, 25, 20, 15, 10, 15, 20, 25, 30, 25, 20, 15, 10, 15, 20, 25, 30, 25]
    }
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

// Generate dates for the last N days
function getLastNDays(n) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return dates;
}

// Create or update a chart
function createOrUpdateChart(chartId, labels, data, label, color = '#00ffcc') {
  const ctx = document.getElementById(chartId).getContext('2d');
  
  // Clear any existing chart
  if (window[chartId]) {
    window[chartId].destroy();
  }
  
  // Create new chart
  window[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.2)`,
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
              return label.includes('Revenue') ? 
                '$' + value.toLocaleString() : 
                value.toLocaleString();
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
              const value = context.raw;
              return label.includes('Revenue') ? 
                'Revenue: ' + formatCurrency(value) : 
                'Users: ' + value;
            }
          }
        }
      }
    }
  });
  
  return window[chartId];
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
    
    // Update main stats
    document.getElementById("total-revenue").textContent = formatCurrency(revenueData.totalRevenue || 1250000);
    document.getElementById("total-users").textContent = usersData.totalUsers || "421";
    document.getElementById("total-volume").textContent = formatCurrency(revenueData.totalVolume || 318000);
    document.getElementById("tracked-assets").textContent = assetsData.trackedAssets || "87";
    
    // Update time period stats
    document.getElementById("seven-day-revenue").textContent = formatCurrency(revenueData.sevenDayRevenue || 42500);
    document.getElementById("one-month-revenue").textContent = formatCurrency(revenueData.oneMonthRevenue || 156000);
    document.getElementById("all-time-revenue").textContent = formatCurrency(revenueData.allTimeRevenue || 1250000);
    
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
    
    // Create Revenue Chart
    const revenueLabels = revenueData.dailyRevenue ? 
      revenueData.dailyRevenue.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }) : 
      getLastNDays(7);
    
    const revenueValues = revenueData.dailyRevenue ? 
      revenueData.dailyRevenue.map(item => item.totalUsdValue) : 
      [42000, 45000, 48000, 51000, 55000, 60000, 65000];
    
    createOrUpdateChart('revenueChart', revenueLabels, revenueValues, 'Daily Revenue');
    
    // Create Activity Chart
    const activityTimeRange = document.querySelector('.time-btn[data-chart="activity"].active')?.dataset.range || '7d';
    const activityData = usersData.activeUsers?.[activityTimeRange] || MOCK_DATA.users.activeUsers['7d'];
    const activityLabels = getLastNDays(activityData.length);
    
    createOrUpdateChart('activityChart', activityLabels, activityData, 'Active Users', '#4d94ff');
    
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
    document.getElementById("total-revenue").textContent = "$1,250,000";
    document.getElementById("total-users").textContent = "421";
    document.getElementById("total-volume").textContent = "$318,000";
    document.getElementById("tracked-assets").textContent = "87";
    document.getElementById("seven-day-revenue").textContent = "$42,500";
    document.getElementById("one-month-revenue").textContent = "$156,000";
    document.getElementById("all-time-revenue").textContent = "$1,250,000";
    document.getElementById('average-daily').textContent = "$4,250";
    document.getElementById('seven-day-average').textContent = "$5,750";
    document.getElementById('daily-growth').textContent = "5.2%";
    
    // Create fallback charts
    createOrUpdateChart('revenueChart', getLastNDays(7), [42000, 45000, 48000, 51000, 55000, 60000, 65000], 'Daily Revenue');
    createOrUpdateChart('activityChart', getLastNDays(7), [12, 19, 3, 5, 2, 3, 7], 'Active Users', '#4d94ff');
    
  } finally {
    // Hide loading indicator
    document.getElementById('loading-indicator').classList.add('hidden');
  }
}

// Handle time filter buttons for revenue chart
function setupTimeFilterButtons() {
  // Revenue time filter buttons
  const revenueTimeButtons = document.querySelectorAll('.time-filter .time-btn:not([data-chart])');
  revenueTimeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons in this group
      revenueTimeButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // In a real app, this would trigger data refresh with different time range
      console.log(`Revenue time range changed to: ${this.dataset.range}`);
      
      // For demo purposes, refresh the dashboard
      updateDashboard();
    });
  });
  
  // Activity chart time filter buttons
  const activityTimeButtons = document.querySelectorAll('.time-filter .time-btn[data-chart="activity"]');
  activityTimeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons in this group
      activityTimeButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Update the activity chart with the selected time range
      const timeRange = this.dataset.range;
      console.log(`Activity time range changed to: ${timeRange}`);
      
      // Get the appropriate data for the selected time range
      const activityData = MOCK_DATA.users.activeUsers[timeRange];
      const activityLabels = getLastNDays(activityData.length);
      
      // Update the chart
      createOrUpdateChart('activityChart', activityLabels, activityData, 'Active Users', '#4d94ff');
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