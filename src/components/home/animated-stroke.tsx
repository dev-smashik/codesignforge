type AnimatedStrokeProps = {
  className: string;
};

const strokeTrail = Array.from({ length: 24 }, (_, index) => ({
  length: 24 - index,
  opacity: index / 23,
}));

export function AnimatedStroke({ className }: AnimatedStrokeProps) {
  return (
    <svg className={className} viewBox="0 0 134.5 49.5" preserveAspectRatio="none" aria-hidden="true">
      {strokeTrail.map(({ length, opacity }) => {
        const offset = length - 24;
        return (
          <rect
            key={length}
            x=".25"
            y=".25"
            width="134"
            height="49"
            rx="8.25"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            strokeOpacity={opacity}
            pathLength="100"
            strokeDasharray={`${length} ${100 - length}`}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={offset}
              to={offset - 100}
              dur="6s"
              repeatCount="indefinite"
            />
          </rect>
        );
      })}
    </svg>
  );
}
