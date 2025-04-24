"use client";
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface AudioWaveSurferProps {
  audioURL: string;
}

const AudioWaveSurfer: React.FC<AudioWaveSurferProps> = ({ audioURL }) => {
  const AudioWaveSurferRef = useRef<HTMLDivElement | null>(null);
  const waveSurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (AudioWaveSurferRef.current && !waveSurfer.current) {
      waveSurfer.current = WaveSurfer.create({
        container: AudioWaveSurferRef.current,
        waveColor: "#ddd",
        progressColor: "#4a90e2",
        cursorColor: "#4a90e2",
        height: 80,
      });
    }

    if (waveSurfer.current) {
      waveSurfer.current.load(audioURL);
    }

    return () => {
      waveSurfer.current?.destroy();
    };
  }, [audioURL]);

  return <div ref={AudioWaveSurferRef} />;
};

export default AudioWaveSurfer;
