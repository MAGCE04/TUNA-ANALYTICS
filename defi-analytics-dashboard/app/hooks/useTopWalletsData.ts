import { useState, useEffect } from 'react';
import axios from 'axios';
import { TopWallet } from '../types';

export function useTopWalletsData() {
  const [topWallets, setTopWallets] = useState<TopWallet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Fetch data from our API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      
      // Fetch data from our API
      const response = await axios.get(`/api/wallets?${params.toString()}`);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      setTopWallets(response.data.topWallets || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch top wallet data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 12 hours
    const refreshInterval = setInterval(fetchData, 12 * 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Refetch data when limit changes
  useEffect(() => {
    fetchData();
  }, [limit]);
  
  return {
    topWallets,
    isLoading,
    error,
    limit,
    lastUpdated,
    setLimit,
  };
}