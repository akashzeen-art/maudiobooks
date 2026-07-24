import { useEffect, useState } from "react";

/** Format seconds as e.g. `1h 05m` or `42m 10s`. */
export function formatAudioDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}

/** Load actual duration from an audio URL via metadata; use fallback while loading/on error. */
export function useAudioDuration(src: string, fallback = "") {
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(Boolean(src));

  useEffect(() => {
    if (!src) {
      setLoading(false);
      setDuration(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setDuration(null);

    const audio = new Audio();
    audio.preload = "metadata";
    // Helps some CDNs expose duration without full download
    audio.crossOrigin = "anonymous";

    const finish = (seconds: number | null) => {
      if (cancelled) return;
      setDuration(seconds);
      setLoading(false);
    };

    const onLoaded = () => {
      const d = audio.duration;
      finish(Number.isFinite(d) && d > 0 ? d : null);
    };

    const onError = () => finish(null);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("error", onError);
    audio.src = src;
    // Force metadata load in some browsers
    audio.load();

    return () => {
      cancelled = true;
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("error", onError);
      audio.removeAttribute("src");
      audio.load();
    };
  }, [src]);

  const fromMeta = duration != null ? formatAudioDuration(duration) : "";
  const label = fromMeta || fallback || (loading ? "…" : "—");

  return { duration, loading, label };
}
