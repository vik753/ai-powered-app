import { PrismaClient, type Review } from '../generated/prisma/client.ts';

export const ReviewRepository = {
  getReviews: (productId: number, limit?: number): Promise<Review[]> => {
    const prisma = new PrismaClient();
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
};
