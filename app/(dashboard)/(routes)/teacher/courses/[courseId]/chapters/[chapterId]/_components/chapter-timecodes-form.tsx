"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, CuePoint } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { ChapterTimecodesList } from "./chapter-timecodes-list";

interface ChapterTimecodesFormProps {
    
    initialData: Chapter & { cuePoints: CuePoint[] };
    courseId: string;
  };

const formSchema = z.object({
  time: z.coerce.number(),
  value: z.string().min(1),
});

export const ChapterTimecodesForm = ({
  initialData,
  courseId
}: ChapterTimecodesFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  }

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        time: 0,
        value: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters/${initialData.id}/cuePoints`, values);
      toast.success("Таймкод створено");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Трапилась помилка");
    }
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
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

  const onEdit = async (id: string) => {
    try {
      setIsUpdating(true);

      await axios.delete(`/api/courses/${courseId}/chapters/${initialData.id}/cuePoints/${id}` );

      toast.success("Таймкод видалено");
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
        Таймкоди
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Відміна</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Додати таймкод
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    disabled={isSubmitting}
                    placeholder="Засначте час таймкоду в секундах"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Зазначте назву таймкоду"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={!isValid || isSubmitting} type="submit">
            Створити
          </Button>
        </form>
      </Form>
      
      )}
      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.cuePoints.length && "text-slate-500 italic"
        )}>
          {!initialData.cuePoints.length && "Немає таймкодів"}
          <ChapterTimecodesList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.cuePoints || []}
          />
        </div>
      )}
    </div>
  )
}