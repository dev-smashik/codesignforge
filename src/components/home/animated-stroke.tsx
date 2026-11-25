import { useLayoutEffect, useRef } from "react";

type AnimatedStrokeProps = {
  className: string;
};

const strokeTrail = Array.from({ length: 24 }, (_, index) => ({
  length: 24 - index,
  opacity: index / 23,
}));

export function AnimatedStroke({ className }: AnimatedStrokeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const syncStrokeGeometry = () => {
      const { width, height } = svg.getBoundingClientRect();
      if (!width || !height) return;

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.querySelectorAll("rect").forEach((rect) => {
        rect.setAttribute("x", "0.5");
        rect.setAttribute("y", "0.5");
        rect.setAttribute("width", String(width - 1));
        rect.setAttribute("height", String(height - 1));
        rect.setAttribute("rx", "8");
      });

      // Start the bright end at the center of the top edge, then let the trail
      // travel around the measured rounded rectangle.
      const radius = Math.min(8, height / 2, width / 2);
      const perimeter = 2 * (width + height - 4 * radius) + 2 * Math.PI * radius;
      const centerPhase = ((width / 2 - radius) / perimeter) * 100;
      svg.querySelectorAll("animate").forEach((animation, index) => {
        const length = 24 - index;
        const offset = length - 1 - centerPhase;
        animation.setAttribute("from", String(offset));
        animation.setAttribute("to", String(offset - 100));
      });
    };

    syncStrokeGeometry();
    const observer = new ResizeObserver(syncStrokeGeometry);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <svg ref={svgRef} className={className} viewBox="0 0 134.5 49.5" preserveAspectRatio="none" aria-hidden="true">
      {strokeTrail.map(({ length, opacity }) => {
        const offset = length - 24;
        return (
          <rect
            key={length}
            x=".5"
            y=".5"
            width="133.5"
            height="48.5"
            rx="8"
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
