# DeFi Tuna Analytics Dashboard

A comprehensive analytics dashboard for DeFi Tuna on Solana blockchain.

## Features

- Real-time protocol metrics
- Revenue tracking and analysis
- User growth and activity monitoring
- Liquidity pool performance
- Trading volume visualization
- Asset allocation insights
- Protocol performance metrics

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts, Chart.js
- **Data Fetching**: SWR
- **Blockchain**: Solana Web3.js

## Getting Started

### Prerequisites

- Node.js 16.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/defi-tuna-analytics.git
cd defi-tuna-analytics
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

- `/app` - Next.js App Router pages and components
- `/app/api` - API routes for data fetching
- `/app/components` - Reusable UI components
- `/app/hooks` - Custom React hooks for data fetching
- `/app/lib` - Utility functions and API clients
- `/app/types` - TypeScript type definitions
- `/public` - Static assets

## Deployment

This project is configured for deployment on Vercel.

## Troubleshooting

If you encounter any issues:

1. Clear the cache and rebuild:
```bash
npm run rebuild
```

2. Check for TypeScript errors:
```bash
npm run type-check
```

3. Force a complete rebuild:
```bash
npm run force-rebuild
```

## License

This project is licensed under the ISC License.