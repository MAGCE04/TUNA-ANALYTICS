import { useState, useEffect } from 'react';
import { TopWallet, TimeRange } from '../types';
import { filterDataByTimeRange } from '../lib/utils';

export const useTopWalletsData = (timeRange: TimeRange) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topWallets, setTopWallets] = useState<TopWallet[]>([]);

  // ✅ Nuevos estados opcionales
  const [limit, setLimit] = useState<number>(5);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/wallets');
        if (!response.ok) {
          throw new Error('Failed to fetch top wallets data');
        }

        const data: TopWallet[] = await response.json();

        const filteredData = filterDataByTimeRange(data, timeRange);
        const sortedWallets = [...filteredData]
          .sort((a, b) => b.tradeVolume - a.tradeVolume)
          .slice(0, limit); // ✅ aplica el limit dinámico

        const formattedWallets = sortedWallets.map(wallet => ({
          ...wallet,
          shortAddress: `${wallet.address.substring(0, 4)}...${wallet.address.substring(wallet.address.length - 4)}`
        }));

        setTopWallets(formattedWallets);
        setLastUpdated(new Date()); // ✅ actualiza fecha
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, limit]); // ✅ escucha cambios en timeRange y limit

  return {
    topWallets,
    loading,
    error,
    limit,
    setLimit,
    lastUpdated,
  };
};
