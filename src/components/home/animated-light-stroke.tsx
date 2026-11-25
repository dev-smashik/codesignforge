type AnimatedLightStrokeProps = { className?: string };

export function AnimatedLightStroke({ className = "" }: AnimatedLightStrokeProps) {
  return <span className={`moving-light-stroke ${className}`} aria-hidden="true" />;
}
