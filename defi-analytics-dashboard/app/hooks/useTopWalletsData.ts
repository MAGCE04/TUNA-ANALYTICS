import { useState, useEffect } from 'react';
import { TopWallet, TimeRange } from '../types';
import { filterDataByTimeRange } from '../lib/utils';

export const useTopWalletsData = (timeRange: TimeRange) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topWallets, setTopWallets] = useState<TopWallet[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/wallets');
        
        if (!response.ok) {
          throw new Error('Failed to fetch top wallets data');
        }
        
        const data = await response.json();
        
        // Filter data based on time range
        const filteredData = filterDataByTimeRange(data, timeRange);
        
        // Sort by trade volume and take top 5
        const sortedWallets = [...filteredData].sort((a, b) => b.tradeVolume - a.tradeVolume).slice(0, 5);
        
        // Format wallet addresses for display
        const formattedWallets = sortedWallets.map(wallet => ({
          ...wallet,
          shortAddress: `${wallet.address.substring(0, 4)}...${wallet.address.substring(wallet.address.length - 4)}`
        }));
        
        setTopWallets(formattedWallets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);
  
  return { topWallets, loading, error };
};