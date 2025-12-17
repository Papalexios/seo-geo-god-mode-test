/**
 * GOD MODE PRIORITY ACTIVATION
 * Direct integration code for GodModePriorityManager
 * Copy and paste this into App.tsx to activate god mode
 */

import { useRef, useState, useEffect } from 'react';
import { GodModePriorityManager } from './GOD_MODE_PRIORITY_MANAGER';

export interface GodModeQueueItem {
  id: string;
  url: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  completedAt?: Date;
}

export function useGodModePriority(serperApiKey?: string) {
  const managerRef = useRef<GodModePriorityManager | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [queue, setQueue] = useState<GodModeQueueItem[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = new GodModePriorityManager({
        serperApiKey: serperApiKey || '',
        maxConcurrentProcessing: 5,
        priorityBoosts: { URGENT: 100, HIGH: 50, NORMAL: 10, LOW: 1 },
        enableBatchProcessing: true,
        autoProcess: true
      });
    }
  }, [serperApiKey]);

  const addToQueue = async (url: string, priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW' = 'NORMAL') => {
    if (!managerRef.current || !isActive) return null;
    try {
      setProcessing(true);
      const item: GodModeQueueItem = {
        id: `${Date.now()}_${Math.random()}`,
        url,
        priority,
        status: 'PENDING',
        createdAt: new Date()
      };
      await managerRef.current.addPriorityURL({ id: item.id, uri: url, priority, processtype: 'FULL_ANALYSIS', status: 'PENDING', createdAt: new Date() });
      setQueue(prev => [...prev, item]);
      return item;
    } catch (error) {
      console.error('Error adding to queue:', error);
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const toggleGodMode = () => {
    setIsActive(prev => !prev);
  };

  const getQueueStatus = () => ({
    total: queue.length,
    pending: queue.filter(q => q.status === 'PENDING').length,
    processing: queue.filter(q => q.status === 'PROCESSING').length,
    completed: queue.filter(q => q.status === 'COMPLETED').length
  });

  return { isActive, toggleGodMode, addToQueue, queue, processing, getQueueStatus };
}

export const GodModeActivationHooks = { useGodModePriority };
