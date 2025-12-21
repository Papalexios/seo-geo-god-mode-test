// SOTA Server Orchestrator - Production-Grade ULTRA SOTA Orchestration Layer
// Durable Objects + KV + Cloudflare Workers

import { executeUltraSOTA } from '../ULTRA_SOTA_COMPLETE_EXAMPLE';

export interface SOTAJobRequest {
  keyword: string;
  existingPages: any[];
  aiClient: any;
  model: string;
  serperApiKey: string;
  serpData: any;
  neuronData?: string | null;
  recentNews?: string | null;
  mode: 'generate' | 'refresh';
  existingContent?: string;
  useGodMode?: boolean;
  requestId: string;
  clientId: string;
  timestamp: number;
}

export interface SOTAJobState {
  id: string;
  requestId: string;
  clientId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  step: number;
  totalSteps: number;
  stepName: string;
  result?: any;
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  retryCount: number;
  maxRetries: number;
  lastAttemptAt?: number;
}

export interface CircuitBreakerState {
  service: string;
  status: 'closed' | 'open' | 'half-open';
  failureCount: number;
  failureThreshold: number;
  lastFailureAt?: number;
  recoveryStartedAt?: number;
  recoveryTimeoutMs: number;
}

// Durable Object State Management
export class SOTAJobQueue {
  state: DurableObjectState;
  jobMap: Map<string, SOTAJobState>;
  circuitBreakers: Map<string, CircuitBreakerState>;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.jobMap = new Map();
    this.circuitBreakers = new Map([
      ['serper', { service: 'serper', status: 'closed', failureCount: 0, failureThreshold: 5, recoveryTimeoutMs: 10000 }],
      ['ai', { service: 'ai', status: 'closed', failureCount: 0, failureThreshold: 3, recoveryTimeoutMs: 30000 }],
      ['wp', { service: 'wp', status: 'closed', failureCount: 0, failureThreshold: 2, recoveryTimeoutMs: 5000 }],
    ]);
  }

  // POST /orchestrator/ultra-sota
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const jobRequest = await request.json() as SOTAJobRequest;
      const jobId = this.generateJobId();

      // Create job state
      const jobState: SOTAJobState = {
        id: jobId,
        requestId: jobRequest.requestId,
        clientId: jobRequest.clientId,
        status: 'queued',
        step: 0,
        totalSteps: 8,
        stepName: 'Initializing',
        createdAt: Date.now(),
        retryCount: 0,
        maxRetries: 5,
      };

      this.jobMap.set(jobId, jobState);
      await this.state.storage.put(`job:${jobId}`, JSON.stringify(jobState));

      // Queue job for async processing
      this.executeJobAsync(jobRequest, jobState);

      return new Response(
        JSON.stringify({ jobId, status: 'queued', requestId: jobRequest.requestId }),
        { status: 202, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: String(error) }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Long-running async execution
  private async executeJobAsync(req: SOTAJobRequest, jobState: SOTAJobState) {
    jobState.status = 'processing';
    jobState.startedAt = Date.now();
    jobState.step = 1;
    jobState.stepName = 'Enhancing Semantic Keywords';
    await this.persistJob(jobState);

    try {
      // Execute ULTRA SOTA with progress tracking
      const result = await executeUltraSOTA({
        keyword: req.keyword,
        existingPages: req.existingPages,
        aiClient: req.aiClient,
        model: req.model,
        serperApiKey: req.serperApiKey,
        serpData: req.serpData,
        neuronData: req.neuronData,
        recentNews: req.recentNews,
        mode: req.mode,
        existingContent: req.existingContent,
        useGodMode: req.useGodMode,
        onProgress: async (msg: string, details?: { step: number; total: number }) => {
          if (details) {
            jobState.step = details.step;
            jobState.stepName = msg;
            await this.persistJob(jobState);
          }
        },
      });

      jobState.status = 'completed';
      jobState.result = result;
      jobState.completedAt = Date.now();
      await this.persistJob(jobState);
    } catch (error) {
      if (jobState.retryCount < jobState.maxRetries) {
        jobState.retryCount++;
        jobState.lastAttemptAt = Date.now();
        const backoffMs = Math.pow(2, jobState.retryCount) * 1000 + Math.random() * 200;
        setTimeout(() => this.executeJobAsync(req, jobState), backoffMs);
      } else {
        jobState.status = 'failed';
        jobState.error = String(error);
        jobState.completedAt = Date.now();
        await this.persistJob(jobState);
      }
    }
  }

  // GET /orchestrator/job/:jobId
  async getJob(jobId: string): Promise<SOTAJobState | null> {
    const stored = await this.state.storage.get(`job:${jobId}`);
    if (stored) {
      return JSON.parse(stored as string);
    }
    return this.jobMap.get(jobId) || null;
  }

  // Check circuit breaker state
  async checkCircuitBreaker(service: string): Promise<boolean> {
    const breaker = this.circuitBreakers.get(service);
    if (!breaker) return true;

    if (breaker.status === 'closed') return true;
    if (breaker.status === 'open') {
      const elapsed = Date.now() - (breaker.lastFailureAt || 0);
      if (elapsed > breaker.recoveryTimeoutMs) {
        breaker.status = 'half-open';
        return true;
      }
      return false;
    }
    return true; // half-open allows one request
  }

  // Record success (reset failures)
  recordSuccess(service: string) {
    const breaker = this.circuitBreakers.get(service);
    if (breaker) {
      breaker.failureCount = 0;
      breaker.status = 'closed';
    }
  }

  // Record failure (increment or open)
  recordFailure(service: string) {
    const breaker = this.circuitBreakers.get(service);
    if (breaker) {
      breaker.failureCount++;
      breaker.lastFailureAt = Date.now();
      if (breaker.failureCount >= breaker.failureThreshold) {
        breaker.status = 'open';
      }
    }
  }

  private async persistJob(jobState: SOTAJobState) {
    await this.state.storage.put(`job:${jobState.id}`, JSON.stringify(jobState));
    this.jobMap.set(jobState.id, jobState);
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Main request handler (Worker)
export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const doId = env.SOTA_QUEUE_NAMESPACE.idFromName('default');
  const object = env.SOTA_QUEUE_NAMESPACE.get(doId);
  return object.fetch(request);
};

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  const url = new URL(request.url);
  const jobId = url.searchParams.get('jobId');

  if (!jobId) {
    return new Response(JSON.stringify({ error: 'jobId required' }), { status: 400 });
  }

  const doId = env.SOTA_QUEUE_NAMESPACE.idFromName('default');
  const object = env.SOTA_QUEUE_NAMESPACE.get(doId);
  const job = await object.getJob(jobId);

  if (!job) {
    return new Response(JSON.stringify({ error: 'job not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(job), { headers: { 'Content-Type': 'application/json' } });
};

type PagesFunction = (context: any) => Promise<Response> | Response;
