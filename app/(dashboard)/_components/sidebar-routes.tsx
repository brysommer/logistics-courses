"use client"

import { BarChart, Compass, Layout, List, MessageSquareDashed, MessageSquareDiffIcon, MessageSquareX, Settings } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const guestRoutes = [
    {
        icon: Layout,
        label: "Моє навчання",
        href: "/bought",
    },
    {
        icon: Compass,
        label: "Пакети навчання",
        href: "search"
    },
    {
        icon: BarChart,
        label: "Глосарій",
        href: "glossary"
    },
    {
        icon: MessageSquareDiffIcon,
        label: "Запитання",
        href: "feedback"
    }
]

const teacherRoutes = [
    {
        icon: List,
        label: "Курси",
        href: "/teacher/courses",
    },
    {
        icon: BarChart,
        label: "Користувачі",
        href: "/teacher/analytics"
    },
]

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname?.includes("/teacher");


    const routes = isTeacherPage ? teacherRoutes : guestRoutes;
    return ( 
        <div className="flex w-full flex-col">
            {
                routes.map((route) => (
                    <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                    />
                ))
            }
            <div className="flex items-center gap-x-2 pl-6">
                <div className="flex items-center">
                <UserButton                
                    afterSignOutUrl="/bought"
                />

                </div>
            </div>
        </div>
     );
}
 
