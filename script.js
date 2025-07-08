// JavaScript for the static dashboard with data fetching

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
    
    // Fetch revenue data
    const revenueData = await fetchData(API_ENDPOINTS.revenue);
    
    if (revenueData) {
      // Update metrics
      document.getElementById('total-revenue').textContent = formatCurrency(revenueData.totalRevenue);
      document.getElementById('average-daily').textContent = formatCurrency(revenueData.averageDailyRevenue);
      document.getElementById('seven-day-average').textContent = formatCurrency(revenueData.sevenDayAverage);
      
      const growthElement = document.getElementById('daily-growth');
      const growthTrend = revenueData.dailyGrowthPercentage >= 0 ? 'up' : 'down';
      const growthClass = revenueData.dailyGrowthPercentage >= 0 ? 'text-success' : 'text-danger';
      
      growthElement.textContent = formatPercentage(Math.abs(revenueData.dailyGrowthPercentage));
      growthElement.className = `text-3xl font-bold ${growthClass}`;
      document.getElementById('growth-direction').textContent = growthTrend;
      
      // Update wallet table
      const tableBody = document.querySelector('tbody');
      tableBody.innerHTML = '';
      
      if (revenueData.walletRevenue && revenueData.walletRevenue.length > 0) {
        revenueData.walletRevenue.forEach(wallet => {
          const row = document.createElement('tr');
          row.className = 'border-b border-border hover:bg-card-hover transition-colors';
          row.innerHTML = `
            <td class="px-4 py-3">${wallet.label || wallet.wallet.substring(0, 8) + '...'}</td>
            <td class="px-4 py-3 text-right font-mono">${formatSol(wallet.solAmount)}</td>
            <td class="px-4 py-3 text-right font-mono">${formatUsdc(wallet.usdcAmount)}</td>
            <td class="px-4 py-3 text-right font-mono">${formatCurrency(wallet.totalUsdValue)}</td>
            <td class="px-4 py-3 text-right">
              <span class="badge badge-success">${formatPercentage(wallet.percentage)}</span>
            </td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td colspan="5" class="px-4 py-3 text-center text-text-muted">
            No data available
          </td>
        `;
        tableBody.appendChild(row);
      }
      
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
    }
  } catch (error) {
    console.error('Error updating dashboard:', error);
  } finally {
    // Hide loading indicator
    document.getElementById('loading-indicator').classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Initial data fetch
  updateDashboard();
  
  // Set up hourly data refresh
  setInterval(updateDashboard, 60 * 60 * 1000); // 1 hour in milliseconds
  
  // Add click handlers for time range buttons
  const timeRangeButtons = document.querySelectorAll('.flex.space-x-2 .btn');
  timeRangeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove primary class from all buttons
      timeRangeButtons.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
      });
      
      // Add primary class to clicked button
      this.classList.remove('btn-outline');
      this.classList.add('btn-primary');
      
      // In a real app, this would trigger data refresh with different time range
      console.log(`Time range changed to: ${this.textContent.trim()}`);
    });
  });
  
  // Add click handlers for navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Prevent default only for this demo since we're not navigating to real pages
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(navLink => {
        navLink.classList.remove('nav-link-active');
        navLink.classList.add('text-text-muted', 'hover:text-text', 'hover:bg-card-hover');
      });
      
      // Add active class to clicked link
      this.classList.add('nav-link-active');
      this.classList.remove('text-text-muted', 'hover:text-text', 'hover:bg-card-hover');
      
      console.log(`Navigation changed to: ${this.textContent.trim()}`);
    });
  });
});