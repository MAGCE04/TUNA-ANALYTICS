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
  users: {
    totalUsers: 421
  },
  revenue: {
    totalVolume: 318000
  },
  assets: {
    trackedAssets: 87
  },
  activity: {
    weeklyData: [12, 19, 3, 5, 2, 3, 7]
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
    // Fetch data from endpoints
    const usersData = await fetchData(API_ENDPOINTS.users) || MOCK_DATA.users;
    const revenueData = await fetchData(API_ENDPOINTS.revenue) || MOCK_DATA.revenue;
    const assetsData = await fetchData(API_ENDPOINTS.wallets) || MOCK_DATA.assets;
    const activityData = await fetchData(API_ENDPOINTS.users) || MOCK_DATA.activity;
    
    // Update UI with data
    document.getElementById("total-users").textContent = usersData.totalUsers || "421";
    document.getElementById("total-volume").textContent = formatCurrency(revenueData.totalVolume || 318000);
    document.getElementById("tracked-assets").textContent = assetsData.trackedAssets || "87";
    
    // Draw chart with data
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    // Clear any existing chart
    if (window.activityChart) {
      window.activityChart.destroy();
    }
    
    // Create new chart
    window.activityChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: 'Active Users',
          data: activityData.weeklyData || [12, 19, 3, 5, 2, 3, 7],
          borderColor: '#00ffcc',
          backgroundColor: 'rgba(0, 255, 204, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#f0f0f0'
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error updating dashboard:', error);
    
    // Fallback to mock data if there's an error
    document.getElementById("total-users").textContent = "421";
    document.getElementById("total-volume").textContent = "$318,000";
    document.getElementById("tracked-assets").textContent = "87";
    
    // Draw chart with mock data
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    // Clear any existing chart
    if (window.activityChart) {
      window.activityChart.destroy();
    }
    
    // Create new chart with mock data
    window.activityChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: 'Active Users',
          data: [12, 19, 3, 5, 2, 3, 7],
          borderColor: '#00ffcc',
          backgroundColor: 'rgba(0, 255, 204, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#f0f0f0'
            }
          }
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Initial data fetch
  updateDashboard();
  
  // Set up hourly data refresh
  setInterval(updateDashboard, 60 * 60 * 1000); // 1 hour in milliseconds
});