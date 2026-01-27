import { prisma } from "../src/lib/prisma";

async function main() {
  const sources = [
    {
      name: "OpenAI",
      website: "https://openai.com",
      trusted: true,
    },
    {
      name: "Hugging Face",
      website: "https://huggingface.co",
      trusted: true,
    },
  ];

  const categories = [
    { name: "LLMs", slug: "llms" },
    { name: "Open Source", slug: "open-source" },
    { name: "AI Tools", slug: "ai-tools" },
  ];

  for (const source of sources) {
    await prisma.source.upsert({
      where: { name: source.name },
      update: {},
      create: source,
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
