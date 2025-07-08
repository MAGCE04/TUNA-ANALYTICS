# DeFi Tuna Analytics Dashboard

A simplified, static dashboard for DeFi analytics visualization that connects to DeFi Tuna endpoints.

## Overview

This project is a clean, minimal setup that runs 100% client-side. It's a static HTML/CSS/JS implementation that can be run locally without any build steps or server requirements, while still connecting to DeFi Tuna API endpoints for real-time data.

## Features

- Clean, modern UI design
- Responsive layout for all device sizes
- Interactive elements (navigation, time range selection)
- Real-time data fetching from DeFi Tuna endpoints
- Automatic hourly data refresh
- Fallback to mock data if API is unavailable

## How to Run

### Option 1: Direct Browser Opening

Simply open the `index.html` file in your web browser.

### Option 2: Using a Local Server

For the best experience, you can use a simple HTTP server:

#### Using Python:

```bash
# If you have Python installed
python -m http.server
# Then open http://localhost:8000 in your browser
```

#### Using Node.js:

```bash
# If you have Node.js installed
npx serve
# Then open the URL shown in the terminal
```

## Project Structure

- `index.html` - Main HTML file with the dashboard structure
- `styles.css` - Custom CSS styles that extend Tailwind CSS
- `script.js` - JavaScript for data fetching, interactivity, and hourly updates

## Data Refresh

The dashboard automatically refreshes data from the DeFi Tuna endpoints:

- Data is refreshed every hour automatically
- Loading indicator shows when data is being fetched

## API Endpoints

The dashboard connects to the following DeFi Tuna endpoints:

- Revenue: https://api.defituna.com/revenue
- Liquidations: https://api.defituna.com/liquidations
- Orders: https://api.defituna.com/orders
- Pools: https://api.defituna.com/pools
- Users: https://api.defituna.com/users
- Wallets: https://api.defituna.com/wallets

If the API endpoints are unavailable, the dashboard falls back to mock data to ensure a consistent user experience.

## Customization

This dashboard uses Tailwind CSS via CDN for styling. You can customize the appearance by:

1. Modifying the Tailwind config in the `<head>` section of `index.html`
2. Adding custom styles in `styles.css`

## License

MIT