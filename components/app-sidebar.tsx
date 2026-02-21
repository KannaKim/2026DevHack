"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { BookPlus } from "lucide-react";
import { MousePointer2 } from "lucide-react";
import { BookUser } from "lucide-react";
import Link from "next/link";
import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Medical history",
    url: "/dashboard/medhistory",
    icon: BookPlus,
  },
  {
    title: "Family",
    url: "/dashboard/family",
    icon: BookUser,
  },
  {
    title: "Doctor's Access",
    url: "/dashboard/docAccess",
    icon: MousePointer2,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthenticatedUser();

  const userData = {
    name: user?.name || "Patient",
    email: user?.phin || "—",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <IconInnerShadowTop className="w-5 h-5" />
                <span className="text-base font-semibold">Med Track.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
