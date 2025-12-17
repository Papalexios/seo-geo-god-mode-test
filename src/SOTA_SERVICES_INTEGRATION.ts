/**
 * SOTA SERVICES INTEGRATION
 * Comprehensive orchestration of all SOTA quality services
 */

import { FabricationDetector } from './FABRICATION_DETECTOR';
import { EnhancedPrompts } from './ENHANCED_PROMPTS';
import { QualityGates } from './QUALITY_GATES';
import { ReferenceValidator } from './REFERENCE_VALIDATOR';
import { DynamicReferenceGenerator } from './DYNAMIC_REFERENCE_GENERATOR';
import { GodModePriorityManager } from './GOD_MODE_PRIORITY_MANAGER';
import { GodModeQualityOverhaul } from './GOD_MODE_QUALITY_OVERHAUL';
import { GeneratedContent } from './types';

export class SOTAServicesManager {
  private fabricationDetector: FabricationDetector;
  private enhancedPrompts: EnhancedPrompts;
  private qualityGates: QualityGates;
  private referenceValidator: ReferenceValidator;
  private dynamicReferences: DynamicReferenceGenerator;
  private godModePriority: GodModePriorityManager;
  private godModeQuality: GodModeQualityOverhaul;

  constructor() {
    this.fabricationDetector = new FabricationDetector();
    this.enhancedPrompts = new EnhancedPrompts();
    this.qualityGates = new QualityGates();
    this.referenceValidator = new ReferenceValidator();
    this.dynamicReferences = new DynamicReferenceGenerator();
    this.godModePriority = new GodModePriorityManager();
    this.godModeQuality = new GodModeQualityOverhaul();
  }

  async processContentThroughSOTAPipeline(
    content: GeneratedContent,
    context: any
  ): Promise<GeneratedContent> {
    const enhanced = await this.enhancedPrompts.enhance(content);
    const referenced = await this.dynamicReferences.generate(enhanced, context);
    const validated = await this.referenceValidator.validate(referenced);
    const authentic = await this.fabricationDetector.detect(validated);
    const quality = await this.qualityGates.enforce(authentic);
    const prioritized = await this.godModePriority.apply(quality);
    const final = await this.godModeQuality.applyOverhaul(prioritized);
    return final;
  }
}

let sotaInstance: SOTAServicesManager | null = null;

export function getSOTAServicesManager(): SOTAServicesManager {
  if (!sotaInstance) {
    sotaInstance = new SOTAServicesManager();
  }
  return sotaInstance;
}
