import { Button } from "@/modules/common/components/ui/button";
import { Pause, Play, Volume2, VolumeX, ZoomIn, ZoomOut } from "lucide-react";

import { Slider } from "@/modules/common/components/ui/slider";

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export type EditorHeaderProps = {
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  volume: number;
  onPlayPause: () => void;
  onVolumeChange: (volume: number[]) => void;
};

export function EditorHeader({
  isReady,
  isPlaying,
  currentTime,
  duration,
  onZoomIn,
  onZoomOut,
  volume,
  onPlayPause,
  onVolumeChange,
}: EditorHeaderProps) {
  return (
    <div className="flex items-center gap-4 border-b p-2 justify-between">
      <div className="flex items-center gap-4">
        <Button onClick={onPlayPause} disabled={!isReady} size={"sm"}>
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <div className="text-muted-foreground text-sm space-x-2">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <Button
            onClick={onZoomIn}
            //   disabled={!isReady}
            disabled
            size={"sm"}
            variant={"secondary"}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={onZoomOut}
            //   disabled={!isReady}
            disabled
            size={"sm"}
            variant={"secondary"}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {volume > 0 ? (
            <Volume2 className="w-4 h-4 text-zinc-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-400" />
          )}
          <Slider
            className="w-24"
            min={0}
            max={1}
            step={0.01}
            value={[volume]}
            onValueChange={onVolumeChange}
            disabled={!isReady}
          />
        </div>
      </div>
    </div>
  );
}
