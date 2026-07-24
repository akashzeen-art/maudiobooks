import { useEffect, useState } from "react";

/** Format seconds as e.g. `1h 05m` or `42m 10s`. */
export function formatAudioDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}

/** Load actual duration from an audio URL via metadata. */
export function useAudioDuration(src: string) {
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDuration(null);

    const audio = new Audio();
    audio.preload = "metadata";

    const onLoaded = () => {
      if (cancelled) return;
      const d = audio.duration;
      setDuration(Number.isFinite(d) ? d : null);
      setLoading(false);
    };

    const onError = () => {
      if (cancelled) return;
      setDuration(null);
      setLoading(false);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("error", onError);
    audio.src = src;

    return () => {
      cancelled = true;
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("error", onError);
      audio.src = "";
    };
  }, [src]);

  return { duration, loading, label: duration != null ? formatAudioDuration(duration) : loading ? "…" : "—" };
}
