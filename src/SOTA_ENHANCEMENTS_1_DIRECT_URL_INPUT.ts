/**
 * SOTA ENHANCEMENT #1: DIRECT URL INPUT FOR GOD MODE
 * Enterprise-Grade Priority Target URL Management
 * 
 * Features:
 * - Priority URL queue with bypass functionality
 * - Real-time URL validation and pre-check
 * - Batch URL processing with intelligent sequencing
 * - Automatic deduplication and normalization
 * - Integration with maintenance engine
 */

import { SitemapPage, ContentItem, GeneratedContent, GenerationContext } from './types';

export interface PriorityUrlConfig {
  urls: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  processingMode: 'immediate' | 'queued';
  skipValidation?: boolean;
  customTags?: string[];
}

export interface UrlValidationResult {
  url: string;
  isValid: boolean;
  errorMessage?: string;
  responseTime?: number;
  statusCode?: number;
  lastModified?: string;
  isReachable: boolean;
}

export class SotaPriorityUrlManager {
  private priorityQueue: Map<string, PriorityUrlConfig> = new Map();
  private processedUrls: Set<string> = new Set();
  private validationCache: Map<string, UrlValidationResult> = new Map();

  /**
   * Add URLs with priority to God Mode queue
   * Bypasses automatic sitemap crawling
   */
  async addPriorityUrls(
    urls: string[],
    priority: 'critical' | 'high' | 'medium' | 'low' = 'high',
    processingMode: 'immediate' | 'queued' = 'immediate'
  ): Promise<UrlValidationResult[]> {
    const normalized = this.normalizeUrls(urls);
    const validationResults: UrlValidationResult[] = [];

    for (const url of normalized) {
      if (this.processedUrls.has(url)) continue;

      const validation = await this.validateUrl(url);
      validationResults.push(validation);

      if (validation.isValid && validation.isReachable) {
        this.priorityQueue.set(url, {
          urls: [url],
          priority,
          processingMode,
          skipValidation: false,
          customTags: ['priority-manual', `priority-${priority}`],
        });
      }
    }

    return validationResults;
  }

  /**
   * Enterprise-grade URL validation
   */
  private async validateUrl(url: string): Promise<UrlValidationResult> {
    // Check cache first
    if (this.validationCache.has(url)) {
      return this.validationCache.get(url)!;
    }

    const result: UrlValidationResult = {
      url,
      isValid: false,
      isReachable: false,
      errorMessage: '',
    };

    try {
      // Validate URL format
      const urlObj = new URL(url);
      result.isValid = true;

      // Test reachability with HEAD request (faster)
      const startTime = performance.now();
      const response = await Promise.race([
        fetch(url, { method: 'HEAD', mode: 'no-cors' }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        ),
      ]) as Response;

      result.responseTime = Math.round(performance.now() - startTime);
      result.statusCode = response.status;
      result.isReachable = response.status < 400;

      // Try to get Last-Modified header
      const lastMod = response.headers.get('last-modified');
      if (lastMod) result.lastModified = lastMod;
    } catch (error: any) {
      result.isValid = /^https?:\/\/./.test(url);
      result.isReachable = false;
      result.errorMessage = error.message;
    }

    this.validationCache.set(url, result);
    return result;
  }

  /**
   * Normalize and deduplicate URLs
   */
  private normalizeUrls(urls: string[]): string[] {
    return Array.from(new Set(
      urls
        .map((u) => u.trim())
        .filter((u) => u.length > 0 && /^https?:\/\//.test(u))
        .map((u) => new URL(u).href) // Normalize
    ));
  }

  /**
   * Get next priority URL for processing
   */
  getNextPriorityUrl(): PriorityUrlConfig | null {
    // Priority order: critical > high > medium > low
    const priorities = ['critical', 'high', 'medium', 'low'] as const;

    for (const priority of priorities) {
      for (const [url, config] of this.priorityQueue.entries()) {
        if (config.priority === priority && !this.processedUrls.has(url)) {
          return config;
        }
      }
    }

    return null;
  }

  /**
   * Mark URL as processed
   */
  markAsProcessed(url: string): void {
    this.processedUrls.add(url);
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    total: number;
    processed: number;
    pending: number;
    byPriority: Record<string, number>;
  } {
    const byPriority = { critical: 0, high: 0, medium: 0, low: 0 };

    for (const config of this.priorityQueue.values()) {
      byPriority[config.priority]++;
    }

    return {
      total: this.priorityQueue.size,
      processed: this.processedUrls.size,
      pending: this.priorityQueue.size - this.processedUrls.size,
      byPriority,
    };
  }

  /**
   * Clear and reset
   */
  clearQueue(): void {
    this.priorityQueue.clear();
    this.processedUrls.clear();
    this.validationCache.clear();
  }
}

export const sotaPriorityUrlManager = new SotaPriorityUrlManager();
