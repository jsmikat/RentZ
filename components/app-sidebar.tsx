import Link from "next/link";
import * as React from "react";

import { AlignVerticalJustifyEnd } from "lucide-react";

import { auth } from "@/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getNavMain } from "@/lib/nav-data";

import SignoutButton from "./signout-button";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Navigation",
      url: "#",
      items: [
        {
          title: "Add Apartment",
          url: "/dashboard/owner/apartment/create",
          // isActive: true,
        },
        {
          title: "Requests",
          url: "/dashboard/owner/apartment/requests",
        },
      ],
    },
  ],
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  const role = session?.user.role;
  const data = {
    navMain: getNavMain(role || "user"),
  };
  return (
    <Sidebar className="p-4" {...props}>
      <SidebarHeader className="flex flex-row">
        <AlignVerticalJustifyEnd className="size-8" />
        <Link href="/" className="font-black text-3xl">
          RentZ
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-4">
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              <SignoutButton />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
