"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Part } from "@prisma/client";

interface ChapterPartFormProps {
  initialData: Part | null;
  courseId: string;
  chapterId: string;
  partsData: Part[];
};

const formSchema = z.object({
  title: z.string().min(1),
});

const selectSchema = z.object({
  partId: z.string().min(1),
})

export const ChapterPartForm = ({
  initialData,
  courseId,
  chapterId,
  partsData,
}: ChapterPartFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [parts, setParts] = useState(partsData);

  useEffect(() => {
    setParts(partsData);
  }, [partsData]);

  const toggleEdit = () => setIsEditing((current) => !current);
  const toggleSelect = () => setIsSelecting((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    //   defaultValues: initialData,
  });
  const formSelect = useForm<z.infer<typeof selectSchema>>({
    resolver: zodResolver(selectSchema),
  })

  const { isSubmitting, isValid } = form.formState;
  const isValidSelect = formSelect.formState.isValid;
  const isSubmittingSelect = formSelect.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/parts`, values);
      toast.success("Модуль створено");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Трапилась помилка");
    }
  }


  const onSubmitSelect = async (values: z.infer<typeof selectSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Розділ оновлено");
      toggleSelect();
      router.refresh();
    } catch {
      toast.error("Трапилась помилка");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Модуль розділа
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Відмінити</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Створити модуль
            </>
          )}
        </Button>
        <Button onClick={toggleSelect} variant="ghost">
          {isSelecting ? (
            <>Відмінити</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Вибрати модуль
            </>
          )}
        </Button>
        
      </div>
      
      {!isEditing && !isSelecting && (
        <p className="text-sm mt-2">
          {initialData?.title || 'Модуль ще не обрано'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Наприклад 'Модуль ...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Створити
              </Button>
            </div>
          </form>
        </Form>
      )}

      {isSelecting && (
        <Form {...formSelect}>
          <form
            onSubmit={formSelect.handleSubmit(onSubmitSelect)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={formSelect.control}
              name="partId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть модуль до якого належить розділ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parts.map((part, index) => (
                          <SelectItem 
                            key={index}
                            value={part.id}
                          >
                              {part.title}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValidSelect || isSubmittingSelect}
                type="submit"
              >
                Вибрати
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}