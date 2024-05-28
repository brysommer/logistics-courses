"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {  Course, Part } from "@prisma/client";

import { cn } from "@/lib/utils";

import { PartsList } from "./parts-list";

interface PartsFormProps {
  initialData: Course & { parts: Part[] };
  courseId: string;
};

export const PartsForm = ({
  initialData,
  courseId
}: PartsFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);


  const router = useRouter();

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/parts/reorder`, {
        list: updateData
      });
      toast.success("Розділ перевпорядковано");
      router.refresh();
    } catch {
      toast.error("Трапилась помилка");
    } finally {
      setIsUpdating(false);
    }
  }


  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Модулі курсу
      </div>
      {(
        <div className={cn(
          "text-sm mt-2",
          !initialData.parts.length && "text-slate-500 italic"
        )}>
          {!initialData.parts.length && "Немає розділів"}
          <PartsList
            onReorder={onReorder}
            items={initialData.parts || []}
          />
        </div>
      )}
      {(
        <p className="text-xs text-muted-foreground mt-4">
          Перетягни щоб впорядкувати модулі
        </p>
      )}
    </div>
  )
}