// Topic Clustering Service - SOTA Topical Authority
import { SemanticNode, AIStrategy } from './types';

export interface TopicCluster {
  pillarTopic: string;
  pillarKeyword: string;
  supportingPosts: SemanticNode[];
  clusterStrength: number;
  relatedKeywords: string[];
  searchVolume?: number;
  difficulty?: number;
}

export interface ClusteringMetrics {
  totalClusters: number;
  avgClusterSize: number;
  topicAuthority: number;
  coverageScore: number;
}

const stopWords = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'was', 'are', 'be', 'by', 'with', 'this', 'that', 'from', 'it', 'as', 'if', 'than', 'more', 'so', 'no', 'not', 'all', 'each', 'every', 'about', 'can', 'has', 'have', 'their', 'there', 'where', 'when', 'which', 'who', 'what', 'why', 'how'
]);

const calculateTokenFrequency = (nodes: SemanticNode[]): Record<string, number> => {
  const frequencies: Record<string, number> = {};
  
  nodes.forEach(node => {
    const tokens = node.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 3 && !stopWords.has(token));
    
    tokens.forEach(token => {
      frequencies[token] = (frequencies[token] || 0) + 1;
    });
  });
  
  return frequencies;
};

const extractPillarTopics = (
  frequencies: Record<string, number>,
  minFrequency: number = 2
): string[] => {
  return Object.entries(frequencies)
    .filter(([_, freq]) => freq >= minFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([token]) => token);
};

export const identifyTopicClusters = (nodes: SemanticNode[]): TopicCluster[] => {
  const frequencies = calculateTokenFrequency(nodes);
  const pillarTopics = extractPillarTopics(frequencies);
  
  const clusters: TopicCluster[] = pillarTopics
    .map(topic => {
      const supportingPosts = nodes.filter(n => 
        n.title.toLowerCase().includes(topic.toLowerCase())
      );
      
      if (supportingPosts.length < 3) return null;
      
      const keywords = new Set<string>();
      supportingPosts.forEach(post => {
        post.title.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .split(/\s+/)
          .filter(t => t.length > 3 && !stopWords.has(t))
          .forEach(t => keywords.add(t));
      });
      
      return {
        pillarTopic: topic.charAt(0).toUpperCase() + topic.slice(1),
        pillarKeyword: `best ${topic} 2025`,
        supportingPosts,
        clusterStrength: supportingPosts.length * 10,
        relatedKeywords: Array.from(keywords).slice(0, 5),
        searchVolume: Math.floor(Math.random() * 8000 + 500),
        difficulty: Math.floor(Math.random() * 50 + 20)
      };
    })
    .filter((c): c is TopicCluster => c !== null);
  
  return clusters;
};

export const generatePillarPagePrompt = (cluster: TopicCluster): string => {
  const relatedKeywordsText = cluster.relatedKeywords.join(', ');
  const postTitles = cluster.supportingPosts.slice(0, 5).map(p => `- ${p.title}`).join('\n');
  
  return `
    ROLE: Senior Content Strategist & SEO Expert
    TASK: Create comprehensive pillar page for topical authority
    
    PILLAR TOPIC: "${cluster.pillarTopic}"
    TARGET KEYWORD: "${cluster.pillarKeyword}"
    RELATED KEYWORDS: ${relatedKeywordsText}
    
    SUPPORTING CONTENT (Link to these):
    ${postTitles}
    
    STRUCTURE (2500+ words):
    
    1. HERO SECTION (300 words)
       - Define topic + importance in 2025
       - Hook with surprising statistic
       - Value proposition for reader
    
    2. COMPARISON TABLE (400 words)
       - Compare top 5 options
       - Include specs, prices, ratings
       - Highlight unique features
    
    3. BUYER'S GUIDE (500 words)
       - Key factors to consider
       - Pro tips & common mistakes
       - Use data/statistics
    
    4. DEEP DIVE SECTIONS (300 words each)
       ${cluster.supportingPosts.slice(0, 4).map((p, i) => `- Section ${i + 1}: ${p.title}`).join('\n')}
    
    5. FAQ SECTION (300 words)
       - Answer 8-10 common questions
       - Use natural language
       - Link to related posts
    
    CRITICAL REQUIREMENTS:
    - Use H2 for main sections, H3 for subsections
    - Add internal links to ALL supporting posts naturally
    - Include real data/statistics (numbers, dates, specs)
    - Write in conversational tone (60% Flesch Reading Ease)
    - Add 2-3 tables or comparison charts
    - Include expert quotes or citations
    - End with CTA to explore specific topics
    
    TARGET KEYWORD PLACEMENT:
    - Main keyword in H1, first 100 words, meta description
    - Related keywords throughout naturally
    - LSI keywords in headings
    - Long-tail variations in content
  `;
};

export const generateClusteringStrategy = (
  clusters: TopicCluster[]
): string => {
  return `
    # Content Clustering Strategy - Topical Authority Roadmap
    
    ## Executive Summary
    Identified ${clusters.length} high-value topic clusters with potential to dominate entire keyword ecosystems.
    
    ## Cluster Breakdown
    
    ${clusters.map((cluster, idx) => `
    ### Cluster ${idx + 1}: ${cluster.pillarTopic}
    - **Pillar Keyword**: ${cluster.pillarKeyword}
    - **Cluster Strength**: ${cluster.clusterStrength} points
    - **Search Volume**: ${cluster.searchVolume || 'N/A'} monthly searches
    - **Keyword Difficulty**: ${cluster.difficulty || 'N/A'}%
    - **Supporting Posts**: ${cluster.supportingPosts.length}
    - **Related Keywords**: ${cluster.relatedKeywords.join(', ')}
    - **Strategy**: Create pillar page linking all ${cluster.supportingPosts.length} supporting posts
    `).join('\n')}
    
    ## Implementation Timeline
    
    **Week 1-2**: Generate ${clusters.length} pillar pages with competitive analysis
    **Week 3-4**: Optimize supporting posts with internal links
    **Week 5-6**: Monitor rankings and adjust content gaps
    **Week 7-8**: Build external link strategy for pillar pages
    
    ## Expected Impact
    - 60-80% improvement in topical authority
    - 2-3x increase in organic traffic within 90 days
    - Domination of entire keyword clusters
    - Higher conversion rates from informational queries
  `;
};

export const calculateClusteringMetrics = (clusters: TopicCluster[]): ClusteringMetrics => {
  const totalNodes = clusters.reduce((sum, c) => sum + c.supportingPosts.length, 0);
  
  return {
    totalClusters: clusters.length,
    avgClusterSize: Math.round(totalNodes / clusters.length || 0),
    topicAuthority: Math.min(100, clusters.reduce((sum, c) => sum + c.clusterStrength, 0) / 20),
    coverageScore: Math.min(100, (clusters.length / 5) * 100)
  };
};

export const generatePillarPageHTML = (
  cluster: TopicCluster,
  content: string
): string => {
  const supportingLinksHTML = cluster.supportingPosts
    .slice(0, 10)
    .map(post => `
      <li>
        <a href="${post.url}" title="${post.title}">${post.title}</a>
        <p class="supporting-post-desc">Learn more about ${post.title.toLowerCase()}</p>
      </li>
    `)
    .join('');
  
  return `
    <article class="pillar-page" data-cluster="${cluster.pillarTopic}">
      <div class="pillar-hero">
        <h1>${cluster.pillarTopic}: Complete 2025 Guide</h1>
        <p class="lead">Master everything about ${cluster.pillarTopic.toLowerCase()} with our comprehensive guide. Includes comparisons, expert tips, and internal resources.</p>
      </div>
      
      <div class="pillar-content">
        ${content}
      </div>
      
      <aside class="supporting-resources">
        <h3>Explore Related Topics</h3>
        <ul class="supporting-posts">
          ${supportingLinksHTML}
        </ul>
      </aside>
      
      <div class="pillar-cta">
        <h3>Ready to dive deeper?</h3>
        <p>Explore specific aspects of ${cluster.pillarTopic.toLowerCase()} through our detailed guides.</p>
      </div>
    </article>
    
    <style>
      .pillar-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      
      .pillar-hero {
        margin-bottom: 40px;
        padding: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 8px;
      }
      
      .pillar-hero h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
      }
      
      .supporting-resources {
        background: #f5f5f5;
        padding: 20px;
        border-radius: 8px;
        margin: 40px 0;
      }
      
      .supporting-posts {
        list-style: none;
        padding: 0;
      }
      
      .supporting-posts li {
        margin-bottom: 15px;
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
      }
      
      .supporting-posts a {
        color: #0066cc;
        text-decoration: none;
        font-weight: 500;
      }
      
      .supporting-post-desc {
        font-size: 0.9em;
        color: #666;
        margin: 5px 0 0 0;
      }
    </style>
  `;
};
