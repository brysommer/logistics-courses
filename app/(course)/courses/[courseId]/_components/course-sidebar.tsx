import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress, Part } from "@prisma/client"
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

  interface PartWithChapters extends Part {
    chapters: (Chapter & {
        userProgress: UserProgress[] | null;
    })[];
}

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
        parts: PartWithChapters[] | null;
    };
    progressCount: number;
}


export const CourseSidebar = async ({
    course,
    progressCount
}: CourseSidebarProps) => {
    const { userId } = auth();

    if(!userId) {
        return redirect("/");
    }

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id,
            }
        }
    })


    return (        
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {/*Check purchase and progress*/}
            </div>
            <div className="flex flex-col w-full">

                {course.parts && course.parts.length > 0 ? 
                    <Accordion type="single" collapsible >
                        {course.parts.map((part, index) => (
                            <AccordionItem key={index} value={`item-${index}`}  >
                                <AccordionTrigger>{part.title}</AccordionTrigger>
                                <AccordionContent>
                                    {part.chapters.map((chapter) => (
                                        <CourseSidebarItem 
                                            key={chapter.id}
                                            id={chapter.id}
                                            label={chapter.title}
                                            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                                            courseId={course.id}
                                            isLocked={!chapter.isFree && !purchase}
                                        />
                                    ))}     
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    : 
                    course.chapters.map((chapter) => (
                        <CourseSidebarItem 
                            key={chapter.id}
                            id={chapter.id}
                            label={chapter.title}
                            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                            courseId={course.id}
                            isLocked={!chapter.isFree && !purchase}
                        />
                    ))
                }
            </div>
        </div>
    )
}