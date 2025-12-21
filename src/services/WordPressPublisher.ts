// REAL WordPress REST API Integration
export interface WordPressConfig {
  siteUrl: string;
  username: string;
  appPassword: string;
}

export interface OptimizedContent {
  title: string;
  content: string;
  metaDescription: string;
  focusKeyword: string;
  schema?: any;
  categories?: number[];
  tags?: number[];
}

export class WordPressPublisher {
  private config: WordPressConfig;

  constructor(config: WordPressConfig) {
    this.config = config;
  }

  private getAuthHeader(): string {
    return `Basic ${btoa(`${this.config.username}:${this.config.appPassword}`)}`;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.siteUrl}/wp-json/wp/v2/users/me`, {
        headers: { 'Authorization': this.getAuthHeader() }
      });
      return response.ok;
    } catch (error) {
      console.error('WordPress connection test failed:', error);
      return false;
    }
  }

  async getPostIdFromURL(url: string): Promise<number | null> {
    try {
      // Extract slug from URL
      const urlObj = new URL(url);
      const slug = urlObj.pathname.split('/').filter(Boolean).pop();
      
      if (!slug) return null;

      // Search for post by slug
      const response = await fetch(
        `${this.config.siteUrl}/wp-json/wp/v2/posts?slug=${slug}`,
        { headers: { 'Authorization': this.getAuthHeader() } }
      );

      if (!response.ok) return null;

      const posts = await response.json();
      return posts[0]?.id || null;
    } catch (error) {
      console.error('Error getting post ID:', error);
      return null;
    }
  }

  async publishPost(
    url: string,
    optimizedContent: OptimizedContent
  ): Promise<{ success: boolean; postId?: number; message: string }> {
    try {
      // Get post ID
      const postId = await this.getPostIdFromURL(url);
      
      if (!postId) {
        return { success: false, message: 'Post not found' };
      }

      // Update post
      const response = await fetch(
        `${this.config.siteUrl}/wp-json/wp/v2/posts/${postId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: optimizedContent.title,
            content: optimizedContent.content,
            excerpt: optimizedContent.metaDescription,
            categories: optimizedContent.categories,
            tags: optimizedContent.tags,
            meta: {
              // Yoast SEO meta fields
              _yoast_wpseo_title: optimizedContent.title,
              _yoast_wpseo_metadesc: optimizedContent.metaDescription,
              _yoast_wpseo_focuskw: optimizedContent.focusKeyword,
              // Schema
              _yoast_wpseo_schema_article_type: 'Article'
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update post');
      }

      const result = await response.json();

      // Add schema markup if provided
      if (optimizedContent.schema) {
        await this.addSchemaMarkup(postId, optimizedContent.schema);
      }

      return {
        success: true,
        postId: result.id,
        message: `Post updated successfully: ${result.link}`
      };
    } catch (error) {
      console.error('WordPress publish error:', error);
      return {
        success: false,
        message: `Error: ${(error as Error).message}`
      };
    }
  }

  private async addSchemaMarkup(postId: number, schema: any): Promise<void> {
    try {
      // Add schema as post meta
      await fetch(
        `${this.config.siteUrl}/wp-json/wp/v2/posts/${postId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            meta: {
              _schema_markup: JSON.stringify(schema)
            }
          })
        }
      );
    } catch (error) {
      console.error('Error adding schema:', error);
    }
  }

  async bulkPublish(
    posts: Array<{ url: string; content: OptimizedContent }>
  ): Promise<Array<{ url: string; success: boolean; message: string }>> {
    const results = [];

    for (const post of posts) {
      const result = await this.publishPost(post.url, post.content);
      results.push({
        url: post.url,
        success: result.success,
        message: result.message
      });
      
      // Rate limiting - wait between requests
      await new Promise(r => setTimeout(r, 1000));
    }

    return results;
  }
}
