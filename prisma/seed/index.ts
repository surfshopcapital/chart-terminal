import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { universe } from './universe';

const db = new PrismaClient();

async function main() {
  console.log(`Seeding ${universe.length} tickers…`);

  for (const ticker of universe) {
    await db.ticker.upsert({
      where: { symbol: ticker.symbol },
      update: {
        name: ticker.name,
        type: ticker.type,
        category: ticker.category,
        description: ticker.description ?? null,
      },
      create: {
        symbol: ticker.symbol,
        name: ticker.name,
        type: ticker.type,
        category: ticker.category,
        description: ticker.description ?? null,
        isActive: true,
      },
    });
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
