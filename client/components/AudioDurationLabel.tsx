import { useAudioDuration } from "../hooks/useAudioDuration";

interface AudioDurationLabelProps {
  src: string;
  /** Shown immediately / if audio metadata cannot be read (CORS). */
  fallback?: string;
  className?: string;
}

export function AudioDurationLabel({
  src,
  fallback = "",
  className = "",
}: AudioDurationLabelProps) {
  const { label } = useAudioDuration(src, fallback);
  return <span className={className}>{label}</span>;
}
