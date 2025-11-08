"use client";
import React, { CSSProperties, useCallback, useRef } from "react";

type ExclusiveAudioProps = {
  src: string;
  group: string; // audios with the same group are mutually exclusive
  controls?: boolean;
  className?: string;
  style?: CSSProperties;
  preload?: "auto" | "metadata" | "none";
};

// A lightweight audio component that guarantees only one audio in the same group plays at a time.
const ExclusiveAudio: React.FC<ExclusiveAudioProps> = ({
  src,
  group,
  controls = true,
  className,
  style,
  preload = "metadata",
}) => {
  const ref = useRef<HTMLAudioElement | null>(null);

  const handlePlay = useCallback(() => {
    const selector = `audio[data-audio-group="${group}"]`;
    const others = document.querySelectorAll<HTMLAudioElement>(selector);
    others.forEach((el) => {
      if (el !== ref.current && !el.paused) {
        try {
          el.pause();
        } catch {}
      }
    });
  }, [group]);

  return (
    <audio
      ref={ref}
      src={src}
      controls={controls}
      data-audio-group={group}
      className={className}
      style={style}
      preload={preload}
      onPlay={handlePlay}
    >
      Your browser does not support the audio element.
    </audio>
  );
};

export default ExclusiveAudio;
