import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { startOfDay } from 'date-fns';

const prisma = new PrismaClient();

export const checkExpiredTransactions = async () => {
  try {
    const today = startOfDay(new Date());
    const now = new Date();

    const expiredTransactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { payment_proof_deadline: { lt: now } },
          { acceptance_deadline: { lt: now } },
        ],
      },
    });

    if (expiredTransactions.length > 0) {
      await Promise.all(
        expiredTransactions.map(async (expiredTransaction) => {
          return await prisma.transaction.update({
            where: { id: expiredTransaction.id },
            data: { status: 'CANCELED' },
          });
        }),
      );
    }

    const pastTransactions = await prisma.transaction.findMany({
      where: { event: { end_date: { lt: today } } },
    });

    if (pastTransactions.length > 0) {
      await Promise.all(
        pastTransactions.map(async (pastTransaction) => {
          return await prisma.transaction.update({
            where: { id: pastTransaction.id },
            data: { status: 'EXPIRED' },
          });
        }),
      );
    }
  } catch (error) {
    console.error('Error checking expired transactions:', error);
  } finally {
    await prisma.$disconnect();
  }
};

cron.schedule('* * * * *', async () => {
  console.log('Running scheduled transaction check...');
  await checkExpiredTransactions();
});

console.log('Cron job for expired transactions started.');
