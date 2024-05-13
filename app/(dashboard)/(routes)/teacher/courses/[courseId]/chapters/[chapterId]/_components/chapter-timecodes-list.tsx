"use client";

import { Chapter, CuePoint } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Clock, Grip, Pencil, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
  items: CuePoint[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
};

export const ChapterTimecodesList = ({
  items,
  onReorder,
  onEdit
}: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  const formatTime = (seconds: number | undefined) => {
    if (seconds == null) return "--:--";
    const date = new Date(0);
    date.setSeconds(seconds);
    const substrStart = seconds / (60 * 60) >= 1 ? 11 : 14;
    const timeString = date.toISOString().substring(substrStart, 19);
    return timeString;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
  }

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable 
                key={chapter.id} 
                draggableId={chapter.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Clock
                        className="h-5 w-5"
                      />
                    </div>
                    {chapter.value}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {(
                        <Badge>
                          {formatTime(chapter.time)}
                        </Badge>
                      )}
                      <Trash
                        onClick={() => onEdit(chapter.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}