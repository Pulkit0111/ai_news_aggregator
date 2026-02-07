import { prisma } from "../src/lib/prisma";

async function main() {
  const sources = [
    {
      name: "OpenAI Blog",
      website: "https://openai.com/blog",
      rssUrl: "https://openai.com/blog/rss.xml",
      trusted: true,
    },
    {
      name: "Hugging Face Blog",
      website: "https://huggingface.co/blog",
      rssUrl: "https://huggingface.co/blog/feed.xml",
      trusted: true,
    },
    {
      name: "Google AI Blog",
      website: "https://blog.google/technology/ai/",
      rssUrl: "https://blog.google/technology/ai/rss/",
      trusted: true,
    },
    {
      name: "MIT Technology Review AI",
      website: "https://www.technologyreview.com/topic/artificial-intelligence/",
      rssUrl: "https://www.technologyreview.com/topic/artificial-intelligence/feed",
      trusted: true,
    },
    {
      name: "DeepMind Blog",
      website: "https://deepmind.google/blog/",
      rssUrl: "https://deepmind.google/blog/rss.xml",
      trusted: true,
    },
    {
      name: "VentureBeat AI",
      website: "https://venturebeat.com/category/ai/",
      rssUrl: "https://venturebeat.com/category/ai/feed/",
      trusted: true,
    },
    {
      name: "TechCrunch AI",
      website: "https://techcrunch.com/category/artificial-intelligence/",
      rssUrl: "https://techcrunch.com/category/artificial-intelligence/feed/",
      trusted: true,
    },
    {
      name: "The Verge AI",
      website: "https://www.theverge.com/ai-artificial-intelligence",
      rssUrl: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
      trusted: true,
    },
    {
      name: "Ars Technica AI",
      website: "https://arstechnica.com/ai/",
      rssUrl: "https://feeds.arstechnica.com/arstechnica/technology-lab",
      trusted: true,
    },
    {
      name: "Towards Data Science",
      website: "https://towardsdatascience.com",
      rssUrl: "https://towardsdatascience.com/feed",
      trusted: true,
    },
    {
      name: "AI Alignment Forum",
      website: "https://www.alignmentforum.org/",
      rssUrl: "https://www.alignmentforum.org/feed.xml",
      trusted: true,
    },
  ];

  const categories = [
    { name: "LLMs", slug: "llms" },
    { name: "Open Source", slug: "open-source" },
    { name: "AI Tools", slug: "ai-tools" },
    { name: "Computer Vision", slug: "computer-vision" },
    { name: "NLP", slug: "nlp" },
    { name: "Research Papers", slug: "research-papers" },
    { name: "AI Ethics", slug: "ai-ethics" },
    { name: "Industry News", slug: "industry-news" },
  ];

  console.log('Seeding sources...');
  for (const source of sources) {
    await prisma.source.upsert({
      where: { name: source.name },
      update: {
        website: source.website,
        rssUrl: source.rssUrl,
        trusted: source.trusted,
      },
      create: source,
    });
    console.log(`✓ ${source.name}`);
  }

  console.log('\nSeeding categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    console.log(`✓ ${category.name}`);
  }

  console.log('\n✓ Seed completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
