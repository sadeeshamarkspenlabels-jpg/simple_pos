import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AuthLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className=" w-full">
        <SidebarTrigger />
        <section className=" p-8 w-full">
          {children}
        </section>
      </main>
    </SidebarProvider>
  );
}
