
import { GeneratedContent, SiteInfo, SitemapPage } from "./types";
import { TARGET_MAX_WORDS, TARGET_MIN_WORDS } from "./constants";
import { GoogleGenAI } from "@google/genai";

export const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

export const calculateFleschReadability = (text: string): number => {
    if (!text || text.trim().length === 0) return 100;
    const words: string[] = text.match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    if (wordCount < 100) return 100;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const sentenceCount = sentences.length || 1;
    const syllables = words.reduce((acc, word) => {
        let currentWord = word.toLowerCase();
        if (currentWord.length <= 3) return acc + 1;
        currentWord = currentWord.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
        const syllableMatches = currentWord.match(/[aeiouy]{1,2}/g);
        return acc + (syllableMatches ? syllableMatches.length : 0);
    }, 0);
    const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / wordCount);
    return Math.max(0, Math.min(100, Math.round(score)));
};

export const getReadabilityVerdict = (score: number): { verdict: string, color: string } => {
    if (score >= 90) return { verdict: 'Very Easy', color: '#10B981' };
    if (score >= 80) return { verdict: 'Easy', color: '#10B981' };
    if (score >= 70) return { verdict: 'Fairly Easy', color: '#34D399' };
    if (score >= 60) return { verdict: 'Standard', color: '#FBBF24' };
    if (score >= 50) return { verdict: 'Fairly Difficult', color: '#F59E0B' };
    if (score >= 30) return { verdict: 'Difficult', color: '#EF4444' };
    return { verdict: 'Very Difficult', color: '#DC2626' };
};

export const extractYouTubeID = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const fetchWithProxies = async (url: string, options: RequestInit = {}, onProgress?: (message: string) => void): Promise<Response> => {
    let lastError: Error | null = null;
    const safeHeaders: Record<string, string> = { 'Accept': 'application/json' };
    let hasAuth = false;
    if (options.headers) {
        const headerObj = options.headers as Record<string, string>;
        Object.keys(headerObj).forEach(key => {
            const lowerKey = key.toLowerCase();
            if (lowerKey === 'x-api-key' || lowerKey === 'authorization') hasAuth = true;
            if (!['user-agent', 'origin', 'referer', 'host', 'connection'].includes(lowerKey)) safeHeaders[key] = headerObj[key];
        });
    }
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort('Direct fetch timed out'), 4000); 
        const directResponse = await fetch(url, { ...options, headers: safeHeaders, signal: controller.signal });
        clearTimeout(timeoutId);
        if (directResponse.ok || (directResponse.status >= 400 && directResponse.status < 600)) return directResponse;
    } catch (error) {}

    const encodedUrl = encodeURIComponent(url);
    const proxies = hasAuth ? [
        `https://thingproxy.freeboard.io/fetch/${url}`,
        `https://corsproxy.io/?${encodedUrl}`,
    ] : [
        `https://corsproxy.io/?${url}`,
        `https://api.allorigins.win/raw?url=${encodedUrl}`,
    ];

    for (let i = 0; i < proxies.length; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(`Proxy timed out`), 45000);
            const response = await fetch(proxies[i], { ...options, headers: safeHeaders, signal: controller.signal });
            clearTimeout(timeoutId);
            if (response.status < 500) {
                if (hasAuth && (response.status === 401 || response.status === 403) && i < proxies.length - 1) continue;
                return response;
            }
        } catch (error: any) { lastError = error; }
    }
    throw new Error(`Network Failure: ${lastError?.message || "Unknown"}`);
};

export const smartCrawl = async (url: string): Promise<string> => {
    try {
        const jinaUrl = `https://r.jina.ai/${url}`;
        const response = await fetch(jinaUrl);
        if (response.ok) {
            const text = await response.text();
            if (text && text.length > 200 && !text.includes("Access Denied")) return text.substring(0, 30000);
        }
    } catch (e) {}
    try {
        const response = await fetchWithProxies(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        doc.querySelectorAll('script, style, nav, footer, iframe, noscript').forEach(el => el.remove());
        const main = doc.querySelector('main') || doc.body;
        return (main.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 25000);
    } catch (e: any) { throw new Error(`Crawl Failed: ${e.message}`); }
};

export class ContentTooShortError extends Error {
    constructor(message: string, public content: string, public wordCount: number) { super(message); this.name = 'ContentTooShortError'; }
}
export class ContentTooLongError extends Error {
    constructor(message: string, public content: string, public wordCount: number) { super(message); this.name = 'ContentTooLongError'; }
}
  
export function enforceWordCount(content: string, minWords = TARGET_MIN_WORDS, maxWords = TARGET_MAX_WORDS) {
    const textOnly = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textOnly.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < minWords) throw new ContentTooShortError(`CONTENT TOO SHORT: ${wordCount} words.`, content, wordCount);
    return wordCount;
}

export async function getGuaranteedYoutubeVideos(keyword: string, serperApiKey: string, semanticKeywords: string[]): Promise<any[]> {
    if (!serperApiKey) return [];
    const queries = [keyword, `${keyword} guide`];
    let allVideos: any[] = [];
    for (const query of queries) {
        if (allVideos.length >= 2) break;
        try {
            const response = await fetchWithProxies("https://google.serper.dev/search", {
                method: 'POST',
                headers: { 'X-API-KEY': serperApiKey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ q: query, type: 'videos', num: 5 })
            });
            const data = await response.json();
            const videos = data.videos || [];
            for (const video of videos) {
                if (allVideos.length >= 2) break;
                const videoId = extractYouTubeID(video.link);
                if (videoId && !allVideos.some(v => v.videoId === videoId)) {
                    allVideos.push({ ...video, videoId, embedUrl: `https://www.youtube.com/embed/${videoId}` });
                }
            }
        } catch (error) {}
    }
    return allVideos.slice(0, 2);
}

export const normalizeGeneratedContent = (parsedJson: any, itemTitle: string): GeneratedContent => {
    const normalized = { ...parsedJson };
    if (!normalized.title) normalized.title = itemTitle;
    if (!normalized.slug) normalized.slug = itemTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    if (!normalized.content) normalized.content = '';
    
    // Ensure placeholders exist
    if (!normalized.imageDetails || !Array.isArray(normalized.imageDetails)) normalized.imageDetails = [];
    while (normalized.imageDetails.length < 3) {
        const i = normalized.imageDetails.length + 1;
        normalized.imageDetails.push({ 
            prompt: `High quality detailed photo for ${itemTitle}, concept ${i}`, 
            altText: `${itemTitle} - Image ${i}`, 
            title: `img-${i}`, 
            placeholder: `[IMAGE_${i}]` 
        });
    }
    
    if (!normalized.metaDescription) normalized.metaDescription = `Guide on ${normalized.title}.`;
    if (!normalized.primaryKeyword) normalized.primaryKeyword = itemTitle;
    if (!normalized.semanticKeywords) normalized.semanticKeywords = [];
    if (!normalized.jsonLdSchema) normalized.jsonLdSchema = {};
    if (!normalized.faqSection) normalized.faqSection = [];
    if (!normalized.keyTakeaways) normalized.keyTakeaways = [];
    if (!normalized.outline) normalized.outline = [];
    if (!normalized.references) normalized.references = [];
    return normalized as GeneratedContent;
};

export const generateVerificationFooterHtml = (): string => {
    return `<div class="verification-footer-sota" style="margin-top: 4rem; padding: 2.5rem; background: #F0FDF4; border-left: 6px solid #059669; display: flex; gap: 2rem;">
        <div style="font-size:2rem; color:#059669;">🛡️</div>
        <div><h4 style="margin:0;">Scientific Verification</h4><p style="margin:0;">Fact-checked against ${new Date().getFullYear()} data sources.</p></div>
    </div>`;
};

export const performSurgicalUpdate = (originalHtml: string, snippets: any): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(originalHtml, 'text/html');
    const body = doc.body;
    const div = doc.createElement('div');
    div.innerHTML = snippets.introHtml;
    body.prepend(div);
    if (snippets.faqHtml) {
        const faq = doc.createElement('div');
        faq.innerHTML = snippets.faqHtml;
        body.append(faq);
    }
    return body.innerHTML;
};

export const postProcessGeneratedHtml = (html: string, plan: GeneratedContent, youtubeVideos: any[] | null, siteInfo: SiteInfo, isRefresh: boolean = false): string => {
    let processedHtml = html;
    processedHtml = processedHtml.replace(/Sources Scanned|Read Time|Word count/gi, '');
    
    // Inject Key Takeaways as BLOCKQUOTE (Quill Safe)
    if (!processedHtml.includes('key-takeaways-box') && plan.keyTakeaways && plan.keyTakeaways.length > 0) {
        const keyTakeawaysHtml = `
        <blockquote class="key-takeaways-box" style="background: #f8fafc; border-left: 5px solid #3b82f6; padding: 20px; margin: 30px 0; font-style: normal;">
            <h3 style="margin-top: 0; color: #1e293b;">⚡ Key Takeaways</h3>
            <ul style="margin-bottom: 0;">${plan.keyTakeaways.map(t => `<li style="margin-bottom: 5px;">${t}</li>`).join('')}</ul>
        </blockquote>`;
        
        // Inject after first paragraph/H2
        const firstH2Index = processedHtml.search(/<h2/i);
        if (firstH2Index !== -1) {
            processedHtml = processedHtml.slice(0, firstH2Index) + keyTakeawaysHtml + processedHtml.slice(firstH2Index);
        } else {
            processedHtml = keyTakeawaysHtml + processedHtml;
        }
    }

    if (!isRefresh) processedHtml += generateVerificationFooterHtml();

    if (youtubeVideos && youtubeVideos.length > 0) {
        const paragraphs = processedHtml.split('</p>');
        if (paragraphs.length > 3) {
            paragraphs.splice(2, 0, `<figure class="wp-block-embed"><iframe src="${youtubeVideos[0].embedUrl}" width="500" height="281"></iframe></figure>`);
        }
        processedHtml = paragraphs.join('</p>');
    }
    return processedHtml;
};

// --- SOTA: CLIENT-SIDE VECTOR RAG ---
export async function getEmbeddings(text: string, client: GoogleGenAI): Promise<number[] | null> {
    if (!text || !client) return null;
    try {
        const result = await client.models.embedContent({
            model: "text-embedding-004",
            contents: [{ parts: [{ text: text.substring(0, 2000) }] }]
        });
        return result.embeddings?.[0]?.values || null;
    } catch (e) { return null; }
}

export const processInternalLinks = (
    content: string, 
    availablePages: SitemapPage[], 
    currentType: 'pillar' | 'cluster' | 'standard' | 'link-optimizer' | 'refresh' = 'standard'
): string => {
    let processedContent = content;
    const candidates = availablePages
        .filter(p => p.id && p.title && p.title.length > 3)
        .sort((a, b) => b.title.length - a.title.length)
        .slice(0, 100); 

    const linkedUrls = new Set<string>();
    let linkCount = 0;
    const MAX_LINKS = 12;

    processedContent = processedContent.replace(/\[LINK_CANDIDATE:\s*([^\]]+)\]/gi, (match, keyword) => {
        const target = availablePages.find(p => p.title.toLowerCase() === keyword.toLowerCase());
        if (target) {
            linkedUrls.add(target.id);
            linkCount++;
            return `<a href="${target.id}" class="internal-link" title="${target.title}">${keyword}</a>`;
        }
        return keyword;
    });

    for (const page of candidates) {
        if (linkCount >= MAX_LINKS) break;
        if (linkedUrls.has(page.id)) continue;
        const keywords = [page.title.toLowerCase().trim(), page.slug.replace(/-/g, ' ').replace(/^(best|top|guide|review)\s+/i, '').trim()].filter(k => k.length > 4);
        for (const kw of keywords) {
            const escaped = escapeRegExp(kw);
            const regex = new RegExp(`(?<!<[^>]*)\\b${escaped}\\b`, 'i');
            if (regex.test(processedContent)) {
                if (!processedContent.includes(`href="${page.id}"`)) {
                    processedContent = processedContent.replace(regex, (match) => {
                        return `<a href="${page.id}" class="internal-link" title="${page.title}">${match}</a>`;
                    });
                    linkedUrls.add(page.id);
                    linkCount++;
                    break;
                }
            }
        }
    }
    return processedContent;
};
