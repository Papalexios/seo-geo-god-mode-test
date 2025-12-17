/**
 * React Hook for SOTA Services
 * Provides easy integration of SOTA quality services in React components
 */

import { useEffect, useRef, useState } from 'react';
import { getSOTAServicesManager } from './SOTA_SERVICES_INTEGRATION';
import { GeneratedContent } from './types';

interface SOTAServicesContextType {
  processContent: (content: GeneratedContent, context?: any) => Promise<GeneratedContent>;
  isProcessing: boolean;
  error: string | null;
}

export function useSOTAServices(): SOTAServicesContextType {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const managerRef = useRef(getSOTAServicesManager());

  useEffect(() => {
    // Initialize services on mount
    const initServices = async () => {
      try {
        const manager = managerRef.current;
        const status = manager.getSOTAServicesStatus?.();
        if (status) {
          console.log('✅ SOTA Services Status:', status);
        }
      } catch (err) {
        console.error('Error initializing SOTA services:', err);
        setError(err instanceof Error ? err.message : 'Initialization failed');
      }
    };

    initServices();
  }, []);

  const processContent = async (
    content: GeneratedContent,
    context?: any
  ): Promise<GeneratedContent> => {
    setIsProcessing(true);
    setError(null);

    try {
      const manager = managerRef.current;
      const result = await manager.processContentThroughSOTAPipeline(content, context);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Processing failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processContent,
    isProcessing,
    error,
  };
}
