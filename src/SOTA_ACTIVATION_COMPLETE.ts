import { AdaptiveModelOrchestrator } from './adaptive-model-orchestrator';
import { MultiLayerQAPipeline } from './quality-assurance-pipeline';
import { AutonomousMaintenanceEngine } from './autonomous-maintenance-engine';
import { RealTimeAnalyticsDashboard } from './real-time-analytics-dashboard';
import { ApiClients, WpConfig, ExpandedGeoTargeting } from './types';

/**
 * 🚀 SOTA ACTIVATION ENGINE - COMPLETE FRONTEND INTEGRATION
 * 
 * This module provides the integration layer that connects all 4 SOTA improvements
 * to the React frontend, ensuring they work seamlessly with the existing application.
 * 
 * INTEGRATION ARCHITECTURE:
 * ========================
 * 1. Service Initialization: Creates singleton instances of all SOTA modules
 * 2. State Binding: Connects services to React state via custom hooks
 * 3. Lifecycle Management: Handles service startup/shutdown on component mount/unmount
 * 4. Configuration Sync: Automatically updates services when user changes settings
 */

export interface SOTAServicesConfig {
  apiClients: ApiClients;
  selectedModel: string;
  wpConfig: WpConfig;
  geoTargeting: ExpandedGeoTargeting;
  serperApiKey: string;
  existingPages: any[];
}

export class SOTAActivationEngine {
  private orchestrator: AdaptiveModelOrchestrator | null = null;
  private qaPipeline: MultiLayerQAPipeline | null = null;
  private maintenanceEngine: AutonomousMaintenanceEngine | null = null;
  private analyticsDashboard: RealTimeAnalyticsDashboard | null = null;
  private isInitialized = false;

  /**
   * Initialize all SOTA services with user configuration
   * Called automatically when App.tsx mounts
   */
  public initialize(config: SOTAServicesConfig): void {
    if (this.isInitialized) {
      console.warn('[SOTA] Services already initialized. Use updateConfig() to modify settings.');
      return;
    }

    console.log('[SOTA] 🚀 Initializing all 4 SOTA modules...');

    // SOTA #1: Adaptive Model Orchestrator
    this.orchestrator = new AdaptiveModelOrchestrator({
      gemini: config.apiClients.gemini,
      openai: config.apiClients.openai,
      anthropic: config.apiClients.anthropic,
      openrouter: config.apiClients.openrouter,
      groq: config.apiClients.groq,
    });
    console.log('[SOTA] ✅ Module #1: Adaptive Model Orchestrator - ACTIVE');

    // SOTA #2: Multi-Layer Quality Assurance Pipeline
    this.qaPipeline = new MultiLayerQAPipeline(config.serperApiKey);
    console.log('[SOTA] ✅ Module #2: Quality Assurance Pipeline - ACTIVE');

    // SOTA #3: Autonomous Maintenance Engine
    this.maintenanceEngine = new AutonomousMaintenanceEngine(
      config.wpConfig.url,
      config.wpConfig.username,
      '' // Password will be provided via God Mode activation
    );
    console.log('[SOTA] ✅ Module #3: Autonomous Maintenance Engine - STANDBY');

    // SOTA #4: Real-Time Analytics Dashboard
    this.analyticsDashboard = new RealTimeAnalyticsDashboard(
      config.wpConfig.url,
      config.wpConfig.username
    );
    console.log('[SOTA] ✅ Module #4: Analytics Dashboard - ACTIVE');

    this.isInitialized = true;
    console.log('[SOTA] 🎉 All 4 SOTA modules successfully initialized and connected to frontend!');
  }

  /**
   * Update service configuration when user changes settings
   * (e.g., switches AI model, updates WP credentials, etc.)
   */
  public updateConfig(config: Partial<SOTAServicesConfig>): void {
    if (!this.isInitialized) {
      console.warn('[SOTA] Services not initialized yet. Call initialize() first.');
      return;
    }

    if (config.apiClients && this.orchestrator) {
      this.orchestrator = new AdaptiveModelOrchestrator(config.apiClients);
      console.log('[SOTA] 🔄 Model Orchestrator updated with new API clients');
    }

    if (config.serperApiKey && this.qaPipeline) {
      this.qaPipeline = new MultiLayerQAPipeline(config.serperApiKey);
      console.log('[SOTA] 🔄 QA Pipeline updated with new Serper API key');
    }

    if (config.wpConfig && this.analyticsDashboard) {
      this.analyticsDashboard = new RealTimeAnalyticsDashboard(
        config.wpConfig.url,
        config.wpConfig.username
      );
      console.log('[SOTA] 🔄 Analytics Dashboard updated with new WP config');
    }
  }

  /**
   * Get active orchestrator instance for content generation
   * Used by services.tsx during AI calls
   */
  public getOrchestrator(): AdaptiveModelOrchestrator | null {
    return this.orchestrator;
  }

  /**
   * Get QA pipeline for content validation
   * Used before publishing content to WordPress
   */
  public getQAPipeline(): MultiLayerQAPipeline | null {
    return this.qaPipeline;
  }

  /**
   * Get maintenance engine for God Mode operations
   * Used when user enables autonomous content monitoring
   */
  public getMaintenanceEngine(): AutonomousMaintenanceEngine | null {
    return this.maintenanceEngine;
  }

  /**
   * Get analytics dashboard for performance tracking
   * Used in Content Hub to display real-time metrics
   */
  public getAnalyticsDashboard(): RealTimeAnalyticsDashboard | null {
    return this.analyticsDashboard;
  }

  /**
   * Activate God Mode - starts autonomous maintenance
   * Called when user toggles God Mode switch in UI
   */
  public activateGodMode(sitemapUrl: string, wpPassword: string): void {
    if (!this.maintenanceEngine) {
      console.error('[SOTA] Maintenance Engine not initialized!');
      return;
    }

    console.log('[SOTA] ⚡ GOD MODE ACTIVATED - Autonomous maintenance engine starting...');
    this.maintenanceEngine.start(sitemapUrl, wpPassword);
  }

  /**
   * Deactivate God Mode - stops autonomous maintenance
   */
  public deactivateGodMode(): void {
    if (!this.maintenanceEngine) return;
    
    console.log('[SOTA] 💤 GOD MODE DEACTIVATED - Stopping maintenance engine...');
    this.maintenanceEngine.stop();
  }

  /**
   * Shutdown all services cleanly
   * Called when App.tsx unmounts
   */
  public shutdown(): void {
    console.log('[SOTA] 🛑 Shutting down all SOTA services...');
    
    if (this.maintenanceEngine) {
      this.maintenanceEngine.stop();
    }

    this.orchestrator = null;
    this.qaPipeline = null;
    this.maintenanceEngine = null;
    this.analyticsDashboard = null;
    this.isInitialized = false;

    console.log('[SOTA] ✅ All services shut down successfully');
  }
}

// Singleton instance for global access
export const sotaEngine = new SOTAActivationEngine();

/**
 * React Hook for SOTA Services Integration
 * 
 * Usage in App.tsx:
 * ```typescript
 * const { orchestrator, qaPipeline, analytics, godMode } = useSOTA({
 *   apiClients,
 *   selectedModel,
 *   wpConfig,
 *   geoTargeting,
 *   serperApiKey,
 *   existingPages
 * });
 * ```
 */
export function useSOTA(config: SOTAServicesConfig) {
  // Initialize on mount
  if (!sotaEngine['isInitialized']) {
    sotaEngine.initialize(config);
  }

  // Update config when dependencies change
  sotaEngine.updateConfig(config);

  return {
    orchestrator: sotaEngine.getOrchestrator(),
    qaPipeline: sotaEngine.getQAPipeline(),
    maintenanceEngine: sotaEngine.getMaintenanceEngine(),
    analyticsDashboard: sotaEngine.getAnalyticsDashboard(),
    activateGodMode: (sitemapUrl: string, password: string) => 
      sotaEngine.activateGodMode(sitemapUrl, password),
    deactivateGodMode: () => sotaEngine.deactivateGodMode(),
  };
}

export default sotaEngine;