import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StarRating } from '@/components/reviews/StarRating.tsx';

type ReviewListProps = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
};

type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

export const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const [reviewData, setReviewData] = useState<GetReviewsResponse>({
    reviews: [],
    summary: null,
  });

  const fetchReviewData = async () => {
    const { data } = await axios.get<Review[]>(
      `/api/products/${productId}/reviews`
    );
    setReviewData({ reviews: data, summary: reviewData?.summary });
  };

  useEffect(() => {
    fetchReviewData();
  }, []);

  if (!reviewData) return 'Loading...';

  return (
    <div>
      {reviewData.reviews.map((review) => (
        <div
          key={review.id}
          className="flex flex-col gap-y-2 mb-2 border-b pb-2"
        >
          <div className="font-semibold">{review.author}</div>
          <StarRating value={review.rating} />
          <div>{review.content}</div>
        </div>
      ))}
    </div>
  );
};
