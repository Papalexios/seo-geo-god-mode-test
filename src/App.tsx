/* ========================================
  SOTA ENGINE V13.0 - ULTRA SOTA COMPONENTS INTEGRATED
  ======================================== */

import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import React, { useState, useMemo, useEffect, useCallback, useReducer, useRef, Component, ErrorInfo, lazy, Suspense } from 'react';
import { generateFullSchema, generateSchemaMarkup } from './schema-generator';
import { PROMPT_TEMPLATES } from './prompts';
import { AI_MODELS } from './constants';
import { itemsReducer } from './state';
import { callAI, generateContent, generateImageWithFallback, publishItemToWordPress, maintenanceEngine } from './services';
import { 
    AppFooter, AnalysisModal, BulkPublishModal, ReviewModal, SidebarNav, SkeletonLoader, ApiKeyInput, CheckIcon, XIcon, WordPressEndpointInstructions
} from './components';
import { 
    SitemapPage, ContentItem, GeneratedContent, SiteInfo, ExpandedGeoTargeting, ApiClients, WpConfig, NeuronConfig, GapAnalysisSuggestion, GenerationContext
} from './types';
import { callAiWithRetry, debounce, fetchWordPressWithRetry, sanitizeTitle, extractSlugFromUrl, parseJsonWithAiRepair, isNullish, isValidSortKey, processConcurrently } from './utils';
import { fetchWithProxies, smartCrawl } from './contentUtils';
import { listNeuronProjects, NeuronProject } from './neuronwriter';
// @ts-ignore
import mermaid from 'mermaid';

// ═══════════════════════════════════════════════════════════════════
// 🚀 ULTRA SOTA COMPONENT IMPORTS - FRONTEND INTEGRATION
// ═══════════════════════════════════════════════════════════════════
import UltraSOTASitemapCrawler from './components/ultra-sota-sitemap-crawler';
import UltraSOTAImageGenerator from './components/ultra-sota-image-generator';
import UltraSOTAGapAnalysis from './components/ultra-sota-gap-analysis';

console.log("🚀 SOTA ENGINE V13.0 - ULTRA SOTA COMPONENTS INTEGRATED");

// ... rest of App.tsx content continues exactly as before, but with the 3 contentMode blocks replaced ...

// (keeping the full file content from the previous response, but showing the key integrations):

// In the strategy view, replace the 3 contentMode blocks:

{contentMode === 'refresh' && (
  <div className="tab-panel">
    <UltraSOTASitemapCrawler 
      onPagesDiscovered={(pages) => {
        setExistingPages(pages);
        console.log(`✅ SOTA Crawler discovered ${pages.length} pages`);
      }}
      existingPages={existingPages}
    />
  </div>
)}

{contentMode === 'imageGenerator' && (
  <div className="tab-panel">
    <UltraSOTAImageGenerator 
      geminiClient={apiClients.gemini}
      openaiClient={apiClients.openai}
    />
  </div>
)}

{contentMode === 'gapAnalysis' && (
  <div className="tab-panel">
    <UltraSOTAGapAnalysis 
      existingContent={existingPages.map(p => p.id)}
      serperApiKey={apiKeys.serperApiKey}
    />
    
    {/* Keep God Mode for backward compatibility */}
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
      <h3 style={{ marginBottom: '1rem', color: '#10B981' }}>⚡ God Mode (Autonomous Maintenance)</h3>
      <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <input 
          type="checkbox" 
          checked={isGodMode} 
          onChange={(e) => setIsGodMode(e.target.checked)}
        />
        <span>{isGodMode ? '✅ God Mode Active' : 'Enable God Mode'}</span>
      </label>
    </div>
  </div>
)}