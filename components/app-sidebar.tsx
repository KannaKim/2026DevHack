"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import users from "@/data/user";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { BookPlus } from "lucide-react";
import { MousePointer2 } from "lucide-react";
import { BookUser } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: users[0].name,
    email: `${users[0].id}`,
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Med Track.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
