import { Menu } from "lucide-react";
import { Chapter, Course, UserProgress, Part } from "@prisma/client";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

import { CourseSidebar } from "./course-sidebar";

interface PartWithChapters extends Part {
  chapters: (Chapter & {
      userProgress: UserProgress[] | null;
  })[];
}

interface CourseMobileSidebarProps {
  course: Course & {
      chapters: (Chapter & {
          userProgress: UserProgress[] | null;
      })[];
      parts: PartWithChapters[] | null;
  };
  progressCount: number;
}

export const CourseMobileSidebar = ({ 
  course,
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  )
}