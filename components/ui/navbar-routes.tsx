"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { BarChart, Compass, LayoutDashboard, LayoutDashboardIcon, LogOut, MessageSquareDiffIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher";


export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");

  return (
    <>
      <div className="md:visible invisible flex   gap-x-2">
        <Link href="/bought">
          <Button size="sm" variant="secondary">
            <LayoutDashboardIcon className="h-4 w-4 mr-2" />
              Мій профіль
          </Button>
        </Link>
        <Link href="/search">
          <Button size="sm" variant="secondary">
            <Compass className="h-4 w-4 mr-2" />
              Пакети навчання
          </Button>
        </Link>        
        <Link href="/glossary">
          <Button size="sm" variant="secondary">
            <BarChart className="h-4 w-4 mr-2" />
              Глоссарій
          </Button>
        </Link>
        <Link href="/feedback">
          <Button size="sm" variant="secondary">
            <MessageSquareDiffIcon className="h-4 w-4 mr-2" />
              Зворотній звязок
          </Button>
        </Link>
      </div>
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              На головну
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Режим вчителя
            </Button>
          </Link>
        ) : null}
        <UserButton
          afterSignOutUrl="/"
        />
      </div>
    </>
  )
}