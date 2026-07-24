import { useAudioDuration } from "../hooks/useAudioDuration";

interface AudioDurationLabelProps {
  src: string;
  className?: string;
}

export function AudioDurationLabel({ src, className = "" }: AudioDurationLabelProps) {
  const { label } = useAudioDuration(src);
  return <span className={className}>{label}</span>;
}
