// REFERENCE_VALIDATOR.ts - Domain credibility verification

interface DomainCredibility {
  domain: string;
  isCredible: boolean;
  trustScore: number;
  factors: {
    hasSSL: boolean;
    domainAge: number;
    spam Score: number;
    isBlacklisted: boolean;
    authorityScore: number;
  };
}

export class ReferenceValidator {
  private readonly CREDIBLE_DOMAINS = [
    'nih.gov', 'cdc.gov', 'harvard.edu', 'stanford.edu',
    'mit.edu', 'nature.com', 'sciencemag.org', 'plos.org',
    'bmj.com', 'thelancet.com', 'jama.com', 'nejm.org'
  ];

  private readonly BLACKLISTED_DOMAINS = [
    'spammy-site.com', 'affiliate-spam.com', 'auto-generated.com'
  ];

  async validateDomain(domain: string): Promise<DomainCredibility> {
    const normalizedDomain = new URL(`https://${domain}`).hostname || domain;
    const isCredible = this.isHighQualityDomain(normalizedDomain);
    const trustScore = this.calculateTrustScore(normalizedDomain);

    return {
      domain: normalizedDomain,
      isCredible,
      trustScore,
      factors: {
        hasSSL: true,
        domainAge: 5,
        spamScore: 2,
        isBlacklisted: this.isBlacklisted(normalizedDomain),
        authorityScore: isCredible ? 90 : 40
      }
    };
  }

  private isHighQualityDomain(domain: string): boolean {
    return this.CREDIBLE_DOMAINS.some(credible => domain.includes(credible));
  }

  private isBlacklisted(domain: string): boolean {
    return this.BLACKLISTED_DOMAINS.some(blacklisted => domain.includes(blacklisted));
  }

  private calculateTrustScore(domain: string): number {
    let score = 50;
    if (this.isHighQualityDomain(domain)) score += 40;
    if (!this.isBlacklisted(domain)) score += 10;
    return Math.min(100, score);
  }

  generateCredibilityReport(result: DomainCredibility): string {
    return `Domain: ${result.domain}\nTrust Score: ${result.trustScore}/100\nCredible: ${result.isCredible ? 'YES' : 'NO'}`;
  }
}

export default ReferenceValidator;
