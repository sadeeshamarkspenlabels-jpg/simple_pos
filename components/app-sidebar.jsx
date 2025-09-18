"use client";
import {
  Box,
  User,
  ChartLine,
  FileText,
  BadgeDollarSign,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

// Menu items
const items = [
  { title: "Dashboard", url: "/", icon: ChartLine },
  { title: "Sales", url: "/sales", icon: BadgeDollarSign },
  { title: "Products", url: "/products", icon: Box },
  { title: "Users", url: "/users", icon: User },
  { title: "Reports", url: "/report", icon: FileText },
];

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <Sidebar className="h-screen bg-white shadow-lg border-r border-gray-200">
      <SidebarContent className="flex flex-col justify-between h-full">
        <SidebarGroup>
          <div className="px-6 py-5">
            <h1 className="text-blue-700 font-extrabold text-2xl md:text-3xl">
              POS System
            </h1>
          </div>
          <hr className="border-gray-300" />

          <SidebarGroupContent className="mt-12">
            <SidebarMenu className="flex flex-col gap-6">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="flex items-center gap-4 py-6 px-6 rounded-lg hover:bg-[#C2F9FF0] transition-colors duration-200"
                  >
                    <a href={item.url} className="flex items-center gap-4">
                      <item.icon className="w-6 h-6 text-[#008284]" />
                      <span className="text-gray-800 font-medium text-lg md:text-xl">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="p-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-500 text-white py-3"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
