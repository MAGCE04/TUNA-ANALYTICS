// script.js

// API endpoints
const API_ENDPOINTS = {
  revenue: '/api/revenue',
  liquidations: '/api/liquidations',
  orders: '/api/orders',
  pools: '/api/pools',
  users: '/api/users',
  wallets: '/api/wallets'
};


// Mock data for fallback if API is unavailable
const MOCK_DATA = {
  revenue: {
    totalRevenue: 1250000,
    totalVolume: 318000,
    totalTransactions: 28750,
    averageDailyRevenue: 4250,
    sevenDayAverage: 5750,
    sevenDayRevenue: 42500,
    oneMonthRevenue: 156000,
    allTimeRevenue: 1250000,
    dailyGrowthPercentage: 5.2,
    dailyRevenue: {
      '7d': [42000, 45000, 48000, 51000, 55000, 60000, 65000],
      '1m': [
        38000, 39500, 41000, 40000, 42000, 43500, 45000,
        44000, 46000, 48000, 47000, 49000, 51000, 50000,
        52000, 54000, 53000, 55000, 57000, 56000, 58000,
        60000, 59000, 61000, 63000, 62000, 64000, 65000,
        67000, 68000
      ],
      '3m': [
        30000, 32000, 34000, 36000, 38000, 40000, 42000,
        44000, 46000, 48000, 50000, 52000, 54000, 56000,
        58000, 60000, 62000, 64000, 66000, 68000, 70000,
        72000, 74000, 76000, 78000, 80000, 82000, 84000,
        86000, 88000, 90000, 92000, 94000, 96000, 98000,
        100000, 102000, 104000, 106000, 108000, 110000,
        112000, 114000, 116000, 118000, 120000, 122000,
        124000, 126000, 128000, 130000, 132000, 134000,
        136000, 138000, 140000, 142000, 144000, 146000,
        148000, 150000, 152000, 154000, 156000, 158000,
        160000, 162000, 164000, 166000, 168000, 170000,
        172000, 174000, 176000, 178000, 180000, 182000,
        184000, 186000, 188000, 190000, 192000, 194000,
        196000, 198000, 200000
      ],
      '1y': [
        // Simplified yearly data (monthly averages)
        250000, 275000, 300000, 325000, 350000, 375000,
        400000, 425000, 450000, 475000, 500000, 525000
      ]
    },
    walletRevenue: [
      { wallet: 'wallet1', label: 'Wallet 1', solAmount: 1250, usdcAmount: 45000, totalUsdValue: 125000, percentage: 42.5 },
      { wallet: 'wallet2', label: 'Wallet 2', solAmount: 850, usdcAmount: 32000, totalUsdValue: 85000, percentage: 28.9 },
      { wallet: 'wallet3', label: 'Wallet 3', solAmount: 620, usdcAmount: 25000, totalUsdValue: 62000, percentage: 21.1 },
      { wallet: 'wallet4', label: 'Wallet 4', solAmount: 220, usdcAmount: 12000, totalUsdValue: 22000, percentage: 7.5 }
    ]
  },
  users: {
    totalUsers: 1250,
    activeUsers30d: 875,
    newUsers30d: 320,
    retentionRate: 78.5,
    activeUsers: {
      '7d': [120, 135, 142, 156, 168, 175, 182],
      '1m': [
        100, 105, 110, 115, 120, 125, 130, 135, 140, 145,
        150, 155, 160, 165, 170, 175, 180, 185, 190, 195,
        200, 205, 210, 215, 220, 225, 230, 235, 240, 245
      ],
      '3m': [
        80, 85, 90, 95, 100, 105, 110, 115, 120, 125,
        130, 135, 140, 145, 150, 155, 160, 165, 170, 175,
        180, 185, 190, 195, 200, 205, 210, 215, 220, 225,
        230, 235, 240, 245, 250, 255, 260, 265, 270, 275,
        280, 285, 290, 295, 300, 305, 310, 315, 320, 325,
        330, 335, 340, 345, 350, 355, 360, 365, 370, 375,
        380, 385, 390, 395, 400, 405, 410, 415, 420, 425,
        430, 435, 440, 445, 450, 455, 460, 465, 470, 475,
        480, 485, 490, 495, 500
      ]
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

// Format number with commas
function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
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

// Generate months for the last year
function getLastYear() {
  const months = [];
  const date = new Date();
  for (let i = 11; i >= 0; i--) {
    const month = new Date(date.getFullYear(), date.getMonth() - i, 1);
    months.push(month.toLocaleDateString('en-US', { month: 'short' }));
  }
  return months;
}

// Create or update a chart
function createOrUpdateChart(chartId, labels, data, label, color = '#00ffcc') {
  const ctx = document.getElementById(chartId);
  
  if (!ctx) {
    console.error(`Chart element with ID ${chartId} not found`);
    return null;
  }
  
  // Clear any existing chart
  if (window[chartId] && typeof window[chartId].destroy === 'function') {
    window[chartId].destroy();
  }
  
  // Convert hex color to RGB for background
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  // Create new chart
  window[chartId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
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
    document.getElementById("active-users").textContent = formatNumber(usersData.activeUsers30d || 875);
    document.getElementById("total-transactions").textContent = formatNumber(revenueData.totalTransactions || 28750);
    document.getElementById("tracked-assets").textContent = formatNumber(assetsData.trackedAssets || 87);
    
    // Update user metrics
    document.getElementById("new-users").textContent = formatNumber(usersData.newUsers30d || 320);
    document.getElementById("retention-rate").textContent = formatPercentage(usersData.retentionRate || 78.5);
    
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
    const revenueTimeRange = document.querySelector('.time-btn[data-chart="revenue"].active')?.dataset.range || '7d';
    const revenueValues = revenueData.dailyRevenue?.[revenueTimeRange] || MOCK_DATA.revenue.dailyRevenue['7d'];
    
    let revenueLabels;
    if (revenueTimeRange === '1y') {
      revenueLabels = getLastYear();
    } else {
      revenueLabels = getLastNDays(revenueValues.length);
    }
    
    createOrUpdateChart('revenueChart', revenueLabels, revenueValues, 'Daily Revenue');
    
    // Create Activity Chart
    const activityTimeRange = document.querySelector('.time-btn[data-chart="activity"].active')?.dataset.range || '7d';
    const activityData = usersData.activeUsers?.[activityTimeRange] || MOCK_DATA.users.activeUsers[activityTimeRange];
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
    document.getElementById("active-users").textContent = "875";
    document.getElementById("total-transactions").textContent = "28,750";
    document.getElementById("tracked-assets").textContent = "87";
    document.getElementById("new-users").textContent = "320";
    document.getElementById("retention-rate").textContent = "78.5%";
    document.getElementById("seven-day-revenue").textContent = "$42,500";
    document.getElementById("one-month-revenue").textContent = "$156,000";
    document.getElementById("all-time-revenue").textContent = "$1,250,000";
    document.getElementById('average-daily').textContent = "$4,250";
    document.getElementById('seven-day-average').textContent = "$5,750";
    document.getElementById('daily-growth').textContent = "5.2%";
    
    // Create fallback charts
    createOrUpdateChart('revenueChart', getLastNDays(7), MOCK_DATA.revenue.dailyRevenue['7d'], 'Daily Revenue');
    createOrUpdateChart('activityChart', getLastNDays(7), MOCK_DATA.users.activeUsers['7d'], 'Active Users', '#4d94ff');
    
  } finally {
    // Hide loading indicator
    document.getElementById('loading-indicator').classList.add('hidden');
  }
}

// Handle time filter buttons
function setupTimeFilterButtons() {
  // Revenue time filter buttons
  const revenueTimeButtons = document.querySelectorAll('.time-filter .time-btn[data-chart="revenue"]');
  revenueTimeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons in this group
      revenueTimeButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get the time range
      const timeRange = this.dataset.range;
      console.log(`Revenue time range changed to: ${timeRange}`);
      
      // Get the appropriate data for the selected time range
      const revenueValues = MOCK_DATA.revenue.dailyRevenue[timeRange];
      
      // Get appropriate labels
      let labels;
      if (timeRange === '1y') {
        labels = getLastYear();
      } else {
        labels = getLastNDays(revenueValues.length);
      }
      
      // Update the chart
      createOrUpdateChart('revenueChart', labels, revenueValues, 'Daily Revenue');
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