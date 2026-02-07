import { PrismaClient } from '@prisma/client';

// Local database connection
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@localhost:5432/ai_news_aggregator',
    },
  },
});

// Neon database connection (uses DATABASE_URL from .env.local)
const neonPrisma = new PrismaClient();

async function migrate() {
  try {
    console.log('📦 Fetching data from local database...');

    // Fetch all data from local database
    const [sources, categories, articles] = await Promise.all([
      localPrisma.source.findMany(),
      localPrisma.category.findMany(),
      localPrisma.article.findMany({
        include: {
          categories: true,
          source: true,
        },
      }),
    ]);

    console.log(`Found: ${sources.length} sources, ${categories.length} categories, ${articles.length} articles`);

    // Migrate sources
    console.log('📤 Migrating sources...');
    for (const source of sources) {
      await neonPrisma.source.upsert({
        where: { id: source.id },
        update: {
          name: source.name,
          website: source.website,
          rssUrl: source.rssUrl,
          trusted: source.trusted,
          lastFetchedAt: source.lastFetchedAt,
          createdAt: source.createdAt,
        },
        create: source,
      });
    }
    console.log(`✅ Migrated ${sources.length} sources`);

    // Migrate categories
    console.log('📤 Migrating categories...');
    for (const category of categories) {
      await neonPrisma.category.upsert({
        where: { id: category.id },
        update: {
          name: category.name,
          slug: category.slug,
        },
        create: category,
      });
    }
    console.log(`✅ Migrated ${categories.length} categories`);

    // Migrate articles
    console.log('📤 Migrating articles...');
    let migratedCount = 0;
    for (const article of articles) {
      const { categories, source, ...articleData } = article;

      await neonPrisma.article.upsert({
        where: { id: article.id },
        update: {
          title: articleData.title,
          url: articleData.url,
          summary: articleData.summary,
          publishedAt: articleData.publishedAt,
          sourceId: articleData.sourceId,
          createdAt: articleData.createdAt,
          categories: {
            set: categories.map(c => ({ id: c.id })),
          },
        },
        create: {
          ...articleData,
          categories: {
            connect: categories.map(c => ({ id: c.id })),
          },
        },
      });

      migratedCount++;
      if (migratedCount % 10 === 0) {
        console.log(`  Migrated ${migratedCount}/${articles.length} articles...`);
      }
    }
    console.log(`✅ Migrated ${articles.length} articles`);

    console.log('\n🎉 Migration complete!');
    console.log('\nNext steps:');
    console.log('1. Verify data in Neon database using: npx prisma studio');
    console.log('2. Test the application with: npm run dev');
    console.log('3. Deploy to Vercel with: vercel --prod');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await localPrisma.$disconnect();
    await neonPrisma.$disconnect();
  }
}

// Run migration
migrate();
