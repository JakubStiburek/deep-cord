import { useState } from "react";

import { EditorHeader } from "./editor-header";
import { EditorWaveform } from "./editor-waveform";
import { EditorTimeline } from "./editor-timeline";
import { Record as DeepcordRecord } from "../../types";

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

const mockRecord: DeepcordRecord = {
  id: "1234",
  annotationTiers: [
    {
      type: "transcript",
      annotations: [
        {
          id: "1",
          // TODO: fix after OpenAPI update
          value: "Person 1" as unknown as Record<string, never>,
          type: "transcript",
          span: { start: 11.23, end: 16.34 },
        },
        {
          id: "2",
          value: "Person2" as unknown as Record<string, never>,
          type: "transcript",
          span: { start: 17, end: 20.5 },
        },
      ],
    },
  ],
  file: {
    uri: "https://wavesurfer.xyz/wavesurfer-code/examples/audio/mono.mp3",
    id: "123",
    name: "test",
    transcribed: false,
    createdAt: "",
  },
};

export type RecordEditorProps = {
  record: DeepcordRecord | undefined;
};

export function RecordEditor({}: RecordEditorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleReady = (newDuration: number) => {
    setError(null);
    setDuration(newDuration);
    setIsLoading(false);

    setIsReady(true);
  };

  const handleError = (errorMessage: string) => {
    setIsLoading(false);
    if (!isLoading) {
      setError(errorMessage);
    }
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 100, 1000));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 100, 0));
  };

  const handleZoom = (newZoom: number) => {
    setZoom(Math.ceil(newZoom));
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  const handleTimeUpdate = (time: number) => {
    if (time > 0) {
      setCurrentTime(time);
    }
  };

  const handleFinish = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col w-full border rounded-md">
      <EditorHeader
        onPlayPause={togglePlayback}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        isReady={isReady}
        volume={volume}
        onVolumeChange={handleVolumeChange}
      />

      <div className="flex flex-col min-w-[1500px] max-w-[1600px] w-full items-center justify-center">
        <EditorWaveform
          audioUrl={mockRecord.file.uri}
          error={error}
          onError={handleError}
          isLoading={isLoading}
          isReady={isReady}
          onReady={handleReady}
          isPlaying={isPlaying}
          volume={volume}
          zoom={zoom}
          onZoom={handleZoom}
          currentTime={currentTime}
          onTimeUpdate={handleTimeUpdate}
          onPlayPause={setIsPlaying}
          onFinish={handleFinish}
          onSeek={handleSeek}
        />

        {duration ? (
          <EditorTimeline
            record={mockRecord}
            onSeek={handleTimeUpdate}
            currentTime={currentTime}
            zoom={zoom}
            setZoom={setZoom}
            duration={duration}
          />
        ) : null}
      </div>
    </div>
  );
}
