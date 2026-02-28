import 'dotenv/config';
import { PrismaClient } from '../../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { universe } from './universe';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

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
