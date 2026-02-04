import React from 'react';
import axios from 'axios';
import { StarRating } from '@/components/reviews/StarRating.tsx';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button.tsx';
import { HiSparkles } from 'react-icons/hi';

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

type Summary = {
  id: number;
  productId: number;
  content: string;
  generatedAt: string;
  expiresAt: string;
};

type GetReviewsResponse = {
  summary: Summary | null;
  reviews: Review[];
};

const ERROR_MESSAGE = "We can't getting reviews data. Please try again later.";

export const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviewData(),
  });

  const fetchReviewData = async () => {
    const { data } = await axios.get<GetReviewsResponse>(
      `/api/products/${productId}/reviews`
    );
    return data;
  };

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

  if (error) {
    return (
      <div
        className={'text-red-500'}
      >{`${ERROR_MESSAGE} ${error.message}`}</div>
    );
  }

  console.log('reviewData', reviewData);

  if (!reviewData?.reviews.length) {
    return null;
  }

  return (
    <div>
      <div>
        <div className={'mb-2 border-b pb-3'}>
          {reviewData?.summary ? (
            <>
              <h2 className={'font-bold pb-2'}>Summary</h2>
              <p>{reviewData?.summary.content}</p>
            </>
          ) : (
            <Button>
              <HiSparkles />
              Summarize
            </Button>
          )}
        </div>
      </div>
      <div>
        {reviewData?.reviews.map((review) => (
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
    </div>
  );
};
