"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useReducer, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import TranscriptRenderer from "./cuepoints-list";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  cuePoints: CuePoint[]
};

type CuePoint = { time: number; value: string  };


export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
  cuePoints
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Прогрес оновлено");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
      }
    } catch {
      toast.error("Трапилась помилка");
    }
  }
/*
  const cuePoints = [
    {
      time: 60,
      value:
        "1 minutes"
    },
    {
      time: 120,
      value:
        "2 minutes"
    },
    {
      time: 180,
      value:
        "3 minutes"
    },
  ];
*/
  const [currentTime, setCurrentTime] = useState(0);


  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">
            Цей розділ заблоковано
          </p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(
            !isReady && "hidden"
          )}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
          currentTime={currentTime}
        />
      )}
      <TranscriptRenderer 
        cuePoints={cuePoints}
        onCuePointSelected={({ time }) => setCurrentTime(time)}
      />

    </div>
  )
}