import { useState, useEffect } from 'react';
import { LiquidationEvent, DailyLiquidation, TimeRange } from '../types';
import { filterDataByTimeRange } from '../lib/utils';

export const useLiquidationsData = (timeRange: TimeRange) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liquidations, setLiquidations] = useState<LiquidationEvent[]>([]);
  const [dailyLiquidations, setDailyLiquidations] = useState<DailyLiquidation[]>([]);
  const [totalLiquidated, setTotalLiquidated] = useState(0);
  const [avgLiquidationSize, setAvgLiquidationSize] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/liquidations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch liquidations data');
        }
        
        const data = await response.json();
        
        // Filter data based on time range
        const filteredData = filterDataByTimeRange(data, timeRange);
        
        setLiquidations(filteredData);
        
        if (filteredData.length > 0) {
          // Calculate total liquidated
          const total = filteredData.reduce((sum, item) => sum + item.usdValue, 0);
          setTotalLiquidated(total);
          
          // Calculate average liquidation size
          setAvgLiquidationSize(total / filteredData.length);
          
          // Group by day
          const dailyData: { [date: string]: DailyLiquidation } = {};
          
          filteredData.forEach(item => {
            const date = new Date(item.timestamp).toISOString().split('T')[0];
            
            if (!dailyData[date]) {
              dailyData[date] = {
                date,
                totalUsdValue: 0,
                count: 0,
                tokens: {}
              };
            }
            
            dailyData[date].totalUsdValue += item.usdValue;
            dailyData[date].count += 1;
            
            if (!dailyData[date].tokens[item.tokenSymbol]) {
              dailyData[date].tokens[item.tokenSymbol] = {
                amount: 0,
                usdValue: 0
              };
            }
            
            dailyData[date].tokens[item.tokenSymbol].amount += item.tokenAmount;
            dailyData[date].tokens[item.tokenSymbol].usdValue += item.usdValue;
          });
          
          setDailyLiquidations(Object.values(dailyData));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);
  
  return { 
    liquidations, 
    dailyLiquidations, 
    totalLiquidated, 
    avgLiquidationSize, 
    loading, 
    error 
  };
};