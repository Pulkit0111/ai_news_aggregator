/**
 * Auto-categorization based on keywords in article title and summary
 */

type CategoryKeywords = {
  [key: string]: string[];
};

const CATEGORY_KEYWORDS: CategoryKeywords = {
  'llms': ['llm', 'large language model', 'gpt', 'claude', 'gemini', 'chatgpt', 'language model', 'transformer'],
  'open-source': ['open source', 'open-source', 'opensource', 'github', 'hugging face', 'release', 'repository'],
  'ai-tools': ['tool', 'platform', 'api', 'sdk', 'framework', 'library', 'application'],
  'computer-vision': ['vision', 'image', 'video', 'cv', 'object detection', 'segmentation', 'visual', 'dall-e', 'midjourney'],
  'nlp': ['nlp', 'natural language', 'text', 'translation', 'sentiment', 'tokenization', 'embedding'],
  'research-papers': ['paper', 'arxiv', 'research', 'study', 'findings', 'experiment', 'published'],
  'ai-ethics': ['ethics', 'bias', 'fairness', 'safety', 'alignment', 'responsible', 'governance', 'regulation'],
  'industry-news': ['startup', 'funding', 'acquisition', 'release', 'launch', 'partnership', 'investment', 'company']
};

/**
 * Categorizes an article based on keywords found in title and summary
 * @param title - Article title
 * @param summary - Article summary/description
 * @returns Array of matching category slugs
 */
export function categorizeArticle(title: string, summary: string = ''): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const matchedCategories: string[] = [];

  for (const [categorySlug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const hasMatch = keywords.some(keyword => text.includes(keyword.toLowerCase()));
    if (hasMatch) {
      matchedCategories.push(categorySlug);
    }
  }

  // Return at least one category if none matched - default to 'industry-news'
  if (matchedCategories.length === 0) {
    return ['industry-news'];
  }

  return matchedCategories;
}
