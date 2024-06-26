import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";


import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";

import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapter-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";
import { PartsForm } from "./_components/parts-form";


const CourseIdPage = async ({
    params
}: {
    params: { courseId: string }
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                  position: "asc",
                },
            },
            parts: {
                orderBy: {
                  position: "asc",
                },
            },
            attachments: {
              orderBy: {
                createdAt: "desc",
              },
            },
        },
    })

    if (!course) {
        return redirect("/");
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.chapters.some(chapter => chapter.isPublished),
        
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
    <>
     {!course.isPublished && (
        <Banner
          label="Цей курс не опубліковано. Він невидимий для студентів."
        />
      )}
    <div className="p-6">
        <div className="flex flex-col justify-between ">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                    Налаштування курсу
                </h1>
                <span className="text-sm text-slate-700">
                    Заповніть всі поля {completionText}
                </span>
            </div>
            <Actions
                disabled={!isComplete}
                courseId={params.courseId}
                isPublished={course.isPublished}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
                <div className="flex items-center gap-x-2">
                    <IconBadge  icon={LayoutDashboard}/>
                    <h2 className="text-xl">
                        Налаштуй свій курс
                    </h2>
                </div>
                <TitleForm 
                    initialData={course}
                    courseId={course.id}
                />
                <DescriptionForm 
                    initialData={course}
                    courseId={course.id}
                />
                <ImageForm
                    initialData={course}
                    courseId={course.id}
                />
               
            </div>
            <div className="space-y-6">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListChecks} />
                        <h2 className="text-xl">
                            Розділи курсу
                        </h2>
                    </div>
                    
                    <ChaptersForm 
                        initialData={course}
                        courseId={course.id}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListChecks} />
                        <h2 className="text-xl">
                            Сортування модулів
                        </h2>
                    </div>
                    
                    <PartsForm 
                        initialData={course}
                        courseId={course.id}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={CircleDollarSign} />
                        <h2 className="text-xl">
                            Вартість курсу
                        </h2>
                    </div>
                    <PriceForm
                        initialData={course}
                        courseId={course.id}
                    />
                </div>
                {/*
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={File} />
                        <h2 className="text-xl">
                            Матеріали і додатки
                        </h2>
                    </div>
                    <AttachmentForm
                        initialData={course}
                        courseId={course.id}
                    />
                </div>
    */}
            </div>
        </div>
    </div> 
    </> 
    );
}
 
export default CourseIdPage;