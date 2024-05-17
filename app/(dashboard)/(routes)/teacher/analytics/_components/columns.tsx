"use client"

import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PhoneNumber } from "@clerk/nextjs/server";
import { UserArgs } from "@prisma/client/runtime/library";

type User = {
  id: string,
  createdAt: number,
  imageUrl: string,
  emailAddresses: string,
  phoneNumbers: string | null,
  firstName: string | null,
  lastName: string | null,
  lastSignInAt: number | null,
  purchasedCourses: string | null
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
      header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Користувач
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "emailAddresses",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          EMAIL
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phoneNumbers",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Номер телефону
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {

      const phone: string = row.getValue("phoneNumbers") || 'не заповнено';

      return (
      <div>
        {phone}
        </div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Дата реєстрації
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt : string = new Date(row.getValue("createdAt")).toLocaleDateString('uk-UA');
      console.log(createdAt)

      return (
        <div>
          {createdAt}
        </div>
      )
    }
  },
  {
    accessorKey: "purchasedCourses",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Придбані курси
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const courses: string | null = row.getValue("purchasedCourses");

      return (
        courses
      )
    }
  },
  
]