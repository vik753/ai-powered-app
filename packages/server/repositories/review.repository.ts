import { PrismaClient, type Review } from '../generated/prisma/client.ts';
import dayjs = require('dayjs');

const prisma = new PrismaClient();

export const ReviewRepository = {
  getReviews: (productId: number, limit?: number): Promise<Review[]> => {
    const prisma = new PrismaClient();
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  storeReviewSummary: async (productId: number, summary: string) => {
    const now = new Date();
    const expiresAt = dayjs().add(7, 'days').toDate();

    const data = {
      content: summary,
      expiresAt,
      generatedAt: now,
      productId,
    };

    return prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    });
  },

  getReviewSummary: async (productId: number) => {
    return prisma.summary.findUnique({ where: { productId } });
  },
};
