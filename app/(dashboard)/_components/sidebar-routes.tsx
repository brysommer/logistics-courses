"use client"

import { Compass, Layout, Settings } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "search"
    },
    {
        icon: Settings,
        label: "Налаштування",
        href: "settings"
    }
]
export const SidebarRoutes = () => {
    const routes = guestRoutes;
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
 
