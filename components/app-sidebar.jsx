"use client";
import {
  Calendar,
  Home,
  Search,
  Settings,
  Box,
  User,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Loader from "./loader";

// Menu items.
const items = [
  //   {
  //     title: "Home",
  //     url: "/",
  //     icon: Home,
  //   },
  {
    title: "Products",
    url: "/products",
    icon: Box,
  },
  {
    title: "Users",
    url: "/users",
    icon: User,
  },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.clear("token");
      localStorage.clear("role");
      router.push("/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <Sidebar>
      <SidebarContent className=" shadow-2xl">
        <SidebarGroup>
          <div className="p-4">
            <h1 className=" text-blue-700 font-bold text-3xl">POS System</h1>
          </div>
          <hr />
          <SidebarGroupContent className="mt-8 ">
            <SidebarMenu className=" gap-5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-6 hover:bg-blue-200">
                    <a href={item.url}>
                      <item.icon />
                      <span className=" text-[18px]">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button className="bg-red-600 hover:bg-red-400" onClick={handleLogout}>
          Log Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
