"use client";

import { useResolvedSrc } from "@/hooks/use-resolved-src";

/**
 * Image component that resolves `idb://` URLs automatically.
 * Drop-in replacement for <img> — same props.
 */
export function SmartImage({
  src,
  alt,
  className,
  loading,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  onClick?: () => void;
}) {
  const resolved = useResolvedSrc(src);
  // Don't render <img> until src is resolved — avoids empty src warning
  // and prevents the browser from re-downloading the page.
  if (!resolved) {
    return <div className={className} aria-label={alt} role="img" />;
  }
  return (
     
    <img
      src={resolved}
      alt={alt}
      className={className}
      loading={loading}
      onClick={onClick}
    />
  );
}

/**
 * Video component that resolves `idb://` URLs automatically.
 */
export function SmartVideo({
  src,
  poster,
  className,
  controls,
  autoPlay,
  controlsList,
}: {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  controlsList?: string;
}) {
  const resolved = useResolvedSrc(src);
  const resolvedPoster = useResolvedSrc(poster || "");
  if (!resolved) {
    return <div className={className} />;
  }
  return (
    <video
      src={resolved}
      poster={resolvedPoster || undefined}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      controlsList={controlsList as any}
    />
  );
}

/**
 * Audio source resolver — for the playlist player.
 */
export function useSmartAudioSrc(src: string | undefined): string {
  return useResolvedSrc(src);
}
