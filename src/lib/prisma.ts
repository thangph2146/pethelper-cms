import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  console.log('Initializing Prisma Client...');
  console.log('Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@')); // Hide password

  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DIRECT_DATABASE_URL,
      },
    },
  });
};

if (process.env.DIRECT_DATABASE_URL === undefined) {
  console.error('DATABASE_URL is not defined');
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

