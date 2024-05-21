"use client"

import { BarChart, Compass, Layout, List, MessageSquareDashed, MessageSquareDiffIcon, MessageSquareX, Settings } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Мій профіль",
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
        label: "Аналітика",
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
        </div>
     );
}
 
