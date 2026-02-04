import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StarRating } from '@/components/reviews/StarRating.tsx';
import Skeleton from 'react-loading-skeleton';

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviewData = async () => {
    setIsLoading(true);
    const { data } = await axios.get<Review[]>(
      `/api/products/${productId}/reviews`
    );
    setIsLoading(false);
    setReviewData({ reviews: data, summary: reviewData?.summary });
  };

  useEffect(() => {
    fetchReviewData();
  }, []);

  if (isLoading) {
    return (
      <div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-y-2 mb-2 border-b pb-2">
            <Skeleton width={100} />
            <Skeleton width={180} />
            <Skeleton count={3} />
          </div>
        ))}
      </div>
    );
  }

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
