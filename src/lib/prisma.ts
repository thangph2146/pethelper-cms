import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
    
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DIRECT_DATABASE_URL ||"postgresql://thangph2146:XOH3oNCD9ymIcxsrNkQx@pethelper-1.c3myiwi28xeh.ap-southeast-2.rds.amazonaws.com:5432/postgres",
      },
    },
  });
};

if (process.env.DIRECT_DATABASE_URL === undefined) {
  console.error('DATABASE_URL is not defined');
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

