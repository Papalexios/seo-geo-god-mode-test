
import { GeneratedContent, SiteInfo, ExpandedGeoTargeting, WpConfig } from './types';

const ORGANIZATION_NAME = "Your Company Name";
const DEFAULT_AUTHOR_NAME = "Expert Author";

// SOTA: Modified to parse special "__WIKIDATA__" tags from semanticKeywords
function createEntityMentions(semanticKeywords: string[]) {
    return semanticKeywords.map(keyword => {
        let name = keyword;
        let wikidataId = null;

        // Check for Wikidata tag injected by services.tsx
        if (keyword.startsWith("__WIKIDATA__")) {
            const parts = keyword.split("__");
            // Format: __WIKIDATA__Keyword__Q123
            if (parts.length >= 4) {
                name = parts[2];
                wikidataId = parts[3];
            }
        }

        const sameAs = [
            `https://en.wikipedia.org/wiki/${name.replace(/\s+/g, '_')}`,
            `https://www.google.com/search?q=${name.replace(/\s+/g, '+')}&kponly`
        ];

        if (wikidataId) {
            sameAs.push(`https://www.wikidata.org/wiki/${wikidataId}`);
        }

        return {
            "@type": "Thing",
            "name": name,
            "sameAs": sameAs
        };
    });
}

function createPersonSchema(siteInfo: SiteInfo, primaryKeyword: string) {
    return {
        "@type": "Person",
        "@id": `${siteInfo?.authorUrl || ''}#person`,
        "name": siteInfo?.authorName || DEFAULT_AUTHOR_NAME,
        "url": siteInfo?.authorUrl || undefined,
        "sameAs": siteInfo?.authorSameAs,
    };
}

function createOrganizationSchema(siteInfo: SiteInfo, wpConfig: WpConfig) {
    return {
        "@type": "Organization",
        "@id": `${wpConfig?.url || ''}#organization`,
        "name": siteInfo?.orgName || ORGANIZATION_NAME,
        "url": siteInfo?.orgUrl || wpConfig?.url,
        "logo": siteInfo?.logoUrl ? {
            "@type": "ImageObject",
            "@id": `${wpConfig?.url || ''}#logo`,
            "url": siteInfo.logoUrl,
        } : undefined,
    };
}

function createArticleSchema(content: GeneratedContent, wpConfig: WpConfig, orgSchema: any, personSchema: any, articleUrl: string) {
    const today = new Date().toISOString();
    
    // Extract Primary Entity info if available
    const primaryKwRaw = content.semanticKeywords.find(k => k.startsWith("__WIKIDATA__"));
    let mainEntityId = undefined;
    if (primaryKwRaw) {
        const parts = primaryKwRaw.split("__");
        if (parts[3]) mainEntityId = `https://www.wikidata.org/wiki/${parts[3]}`;
    }

    return {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl },
        "headline": content?.title,
        "description": content?.metaDescription,
        "about": {
            "@type": "Thing",
            "name": content?.primaryKeyword,
            "@id": mainEntityId, // SOTA: Explicit ID
            "sameAs": mainEntityId ? [mainEntityId] : undefined
        },
        "mentions": createEntityMentions(content?.semanticKeywords || []),
        "image": (content?.imageDetails ?? []).map(img => img.generatedImageSrc).filter(Boolean),
        "datePublished": today,
        "dateModified": today,
        "author": personSchema,
        "publisher": orgSchema,
    };
}

export function generateFullSchema(content: GeneratedContent, wpConfig: WpConfig, siteInfo: SiteInfo, faqData?: any[], geoTargeting?: ExpandedGeoTargeting): object {
    const articleUrl = `${(wpConfig?.url || '').replace(/\/+$/, '')}/${content?.slug || ''}`;
    const schemas: any[] = [];
    
    const organizationSchema = createOrganizationSchema(siteInfo, wpConfig);
    schemas.push(organizationSchema);
    
    const personSchema = createPersonSchema(siteInfo, content?.primaryKeyword || '');
    schemas.push(personSchema);
    
    const articleSchema = createArticleSchema(content, wpConfig, organizationSchema, personSchema, articleUrl);
    schemas.push(articleSchema);

    return { "@context": "https://schema.org", "@graph": schemas };
}

export function generateSchemaMarkup(schemaObject: object): string {
    return `\n\n<!-- wp:html -->\n<script type="application/ld+json">\n${JSON.stringify(schemaObject, null, 2)}\n</script>\n<!-- /wp:html -->\n\n`;
}
