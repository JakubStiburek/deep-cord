import { useEffect, useMemo, useRef } from "react";

import WaveSurfer from "wavesurfer.js";

// import WaveSurferZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";
import WaveSurferTimeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { AlertCircle, Loader2 } from "lucide-react";

interface WaveformProps {
  error: string | null;
  onError?: (error: string) => void;
  isLoading: boolean;
  isReady: boolean;
  onReady: (duration: number) => void;
  isPlaying: boolean;
  volume: number;
  zoom: number;
  onZoom: (zoom: number) => void;
  onPlayPause: (lol: boolean) => void;
  audioUrl: string;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onSeek: (time: number) => void;
  onFinish: () => void;
}

export function EditorWaveform({
  audioUrl,
  error,
  onError,
  isLoading,
  isReady,
  onReady,
  isPlaying,
  volume,
  zoom,
  onZoom,
  currentTime,
  onTimeUpdate,
  onSeek,
  onFinish,
}: WaveformProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const plugins = useMemo(
    () => [
      WaveSurferTimeline.create(),
      //   WaveSurferZoomPlugin.create({
      //     scale: 0.5,

      //     maxZoom: 1000,
      //   }),
    ],
    []
  );

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        barWidth: 1,
        barRadius: 3,
        minPxPerSec: 1000,
        waveColor: "#4c1d95",
        progressColor: "#a855f7",
        cursorColor: "#a855f7",
        height: 128,
        normalize: true,
        plugins,
      });

      wavesurferRef.current.load(audioUrl);

      wavesurferRef.current.on("audioprocess", (time) => {
        onTimeUpdate(time);
      });

      wavesurferRef.current.on("ready", (duration: number) => {
        onReady(duration);
      });

      wavesurferRef.current.on("error", (error) => {
        if (onError) {
          onError(`${error.message && "Failed to load audio"}`);
        }
      });

      wavesurferRef.current.on("seeking", () => {
        if (onSeek) {
          onSeek(wavesurferRef.current!.getCurrentTime());
        }
      });

      wavesurferRef.current.on("zoom", (newZoom) => {
        onZoom(newZoom);
      });

      wavesurferRef.current.on("finish", () => {
        onFinish();
      });

      return () => {
        wavesurferRef.current?.destroy();
      };
    }
  }, [audioUrl, plugins]);

  useEffect(() => {
    if (wavesurferRef.current && isReady) {
      if (isPlaying) {
        wavesurferRef.current.play();
      } else {
        wavesurferRef.current.pause();
      }
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (wavesurferRef.current && isReady) {
      wavesurferRef.current.setVolume(volume);
    }
  }, [volume, isReady]);

  useEffect(() => {
    if (wavesurferRef.current?.getDuration() && isReady) {
      wavesurferRef.current.zoom(zoom);
    }
  }, [zoom, isReady]);

  useEffect(() => {
    if (
      wavesurferRef.current &&
      currentTime !== wavesurferRef.current.getCurrentTime()
    ) {
      wavesurferRef.current.setTime(currentTime);
    }
  }, [currentTime]);

  return (
    <div className="flex w-full flex-col gap-4 pb-5 pl-[100px]">
      {isLoading && (
        <div className="flex gap-2 w-full h-32 items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading audio file</p>
        </div>
      )}

      {error && (
        <div className="flex gap-2 w-full h-32 items-center justify-center">
          <AlertCircle className="text-red-600" />
          <p className="text-muted-foreground">Error: {error}</p>
        </div>
      )}
      <div ref={waveformRef} className="w-full h-32 cursor-col-resize" />
    </div>
  );
}
