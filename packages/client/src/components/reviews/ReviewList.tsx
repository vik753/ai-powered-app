import React from 'react';
import axios from 'axios';
import { StarRating } from '@/components/reviews/StarRating.tsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button.tsx';
import { HiSparkles } from 'react-icons/hi';
import { ReviewSkeleton } from '@/components/reviews/ReviewSkeleton.tsx';

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

type Summary = string;

type SummarizeResponse = {
  summary: Summary;
};

type GetReviewsResponse = {
  summary: Summary | null;
  reviews: Review[];
};

const REVIEW_ERROR_MESSAGE =
  "We couldn't get reviews data. Please try again later.";
const SUMMARY_ERROR_MESSAGE =
  "We couldn't get summary. Please try again later.";

export const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const reviewsQuery = useQuery<GetReviewsResponse, Error>({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviewData(),
  });

  const summarizeMutation = useMutation<SummarizeResponse, Error>({
    mutationFn: () => summarizeReviews(),
  });

  async function fetchReviewData() {
    const { data } = await axios.get<GetReviewsResponse>(
      `/api/products/${productId}/reviews`
    );
    return data;
  }

  async function summarizeReviews() {
    const { data } = await axios.post<{ summary: Summary }>(
      `/api/products/${productId}/reviews/summarize`
    );
    return data;
  }

  if (reviewsQuery.isLoading) {
    return <ReviewSkeleton />;
  }

  if (reviewsQuery.isError) {
    return (
      <div className={'text-red-500'}>
        {REVIEW_ERROR_MESSAGE} {reviewsQuery.error.message}
      </div>
    );
  }

  if (!reviewsQuery.data?.reviews.length) {
    return null;
  }

  const currentSummary =
    reviewsQuery.data?.summary || summarizeMutation.data?.summary;

  return (
    <div>
      <div>
        <div className={'mb-2 border-b pb-3'}>
          {currentSummary ? (
            <>
              <h2 className={'font-bold pb-2'}>Summary</h2>
              <p>{currentSummary}</p>
            </>
          ) : (
            <>
              <Button
                onClick={() => summarizeMutation.mutate()}
                disabled={summarizeMutation.isPending}
              >
                <HiSparkles />
                Summarize
              </Button>
              {summarizeMutation.isPending && (
                <div>
                  <ReviewSkeleton count={1} />
                </div>
              )}
              {summarizeMutation.isError && (
                <div className={'text-red-500 mt-2'}>
                  {SUMMARY_ERROR_MESSAGE} {summarizeMutation.error.message}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div>
        {reviewsQuery.data?.reviews.map((review) => (
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
