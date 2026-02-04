import React, { useState } from 'react';
import axios from 'axios';
import { StarRating } from '@/components/reviews/StarRating.tsx';
import { useQuery } from '@tanstack/react-query';
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

type GetReviewsResponse = {
  summary: Summary | null;
  reviews: Review[];
};

const REVIEW_ERROR_MESSAGE =
  "We can't getting reviews data. Please try again later.";
const SUMMARY_ERROR_MESSAGE =
  "We can't getting summary. Please try again later.";

export const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviewData(),
  });
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const fetchReviewData = async () => {
    const { data } = await axios.get<GetReviewsResponse>(
      `/api/products/${productId}/reviews`
    );
    return data;
  };

  const summarizeReviews = async () => {
    try {
      setSummaryError(null);
      setIsSummaryLoading(true);
      const { data } = await axios.post<{ summary: Summary }>(
        `/api/products/${productId}/reviews/summarize`
      );
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setSummaryError(SUMMARY_ERROR_MESSAGE);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  if (isLoading) {
    return <ReviewSkeleton />;
  }

  if (error) {
    return (
      <div
        className={'text-red-500'}
      >{`${REVIEW_ERROR_MESSAGE} ${error.message}`}</div>
    );
  }

  if (!reviewData?.reviews.length) {
    return null;
  }

  const currentSummary = reviewData?.summary || summary;

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
              <Button onClick={summarizeReviews} disabled={isSummaryLoading}>
                <HiSparkles />
                Summarize
              </Button>
              {isSummaryLoading && (
                <div>
                  <ReviewSkeleton count={1} />
                </div>
              )}
              {summaryError && (
                <div className={'text-red-500 mt-2'}>{summaryError}</div>
              )}
            </>
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
