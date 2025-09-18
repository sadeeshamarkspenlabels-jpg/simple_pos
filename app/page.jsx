"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/components/Dashboard";


export default function Home() {
  const router = useRouter();


  return (
    <SidebarProvider>
      <AppSidebar />
      <main className=" w-full">
        <SidebarTrigger />
        <section className=" p-8 w-full">
          <Dashboard />
        </section>
      </main>
    </SidebarProvider>
  );
}
