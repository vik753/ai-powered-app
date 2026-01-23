type ClassName = {
  classes?: string;
};

const Dot = ({ classes }: ClassName) => (
  <div
    className={`w-3 h-3 bg-neutral-800 rounded-xl animate-pulse ${classes}`}
  ></div>
);

export const TypingIndicator = () => {
  return (
    <div className={'flex gap-1 px-3 py-1'}>
      <Dot />
      <Dot classes={'[animation-delay:0.2s]'} />
      <Dot classes={'[animation-delay:0.4s]'} />
    </div>
  );
};
