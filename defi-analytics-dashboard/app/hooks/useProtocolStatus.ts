import { useState, useEffect } from 'react';
import { TimeRange } from '../types';

interface ProtocolStatus {
  startDate: Date;
  isActive: boolean;
  uptime: number; // in days
  lastUpdate: Date;
}

export const useProtocolStatus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ProtocolStatus>({
    startDate: new Date(2023, 8, 15), // Default start date: September 15, 2023
    isActive: true,
    uptime: 0,
    lastUpdate: new Date()
  });

  useEffect(() => {
    const checkProtocolStatus = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would be an API call to check protocol status
        // For now, we'll use a hardcoded start date based on our analysis
        
        const startDate = new Date(2023, 8, 15); // September 15, 2023
        const now = new Date();
        const uptimeDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        setStatus({
          startDate,
          isActive: true,
          uptime: uptimeDays,
          lastUpdate: now
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    checkProtocolStatus();
  }, []);
  
  return { status, loading, error };
};

// Helper function to adjust data based on protocol start date
export const adjustDataByProtocolStart = <T extends { timestamp: number }>(
  data: T[],
  protocolStartDate: Date
): T[] => {
  const startTimestamp = protocolStartDate.getTime();
  return data.filter(item => item.timestamp >= startTimestamp);
};