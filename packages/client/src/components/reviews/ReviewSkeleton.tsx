import Skeleton from 'react-loading-skeleton';

type Props = {
  count?: number;
};

export const ReviewSkeleton = ({ count = 3 }: Props) => {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mt-3 flex flex-col gap-y-2 mb-2 pb-2">
          <Skeleton width={100} />
          <Skeleton width={180} />
          <Skeleton count={3} />
        </div>
      ))}
    </div>
  );
};
