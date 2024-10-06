import SuspenseLoader from "@/components/SuspenseLoader";
import MyErrorBoundary from "@/ErrorBoundray/ErrorBoundray";
import { cn } from "@/lib/utils";
import { Suspense, useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export default function MainLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      <MyErrorBoundary>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <nav
          className={cn(
            "flex justify-between items-center border-b border-border h-[60px] px-8 z-10 py-2 sticky top-0 bg-zinc-50 dark:bg-zinc-900 transition-all ease-in-out duration-300",
            isOpen
              ? "w-[calc(100%_-_240px)] left-[240px]"
              : "w-[calc(100%_-_90px)] left-[90px]"
          )}
        >
          CORPORATICA
        </nav>
        <main
          className={cn(
            "h-[calc(100vh_-_60px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 p-2",
            isOpen === false ? "lg:ml-[90px]" : "lg:ml-[240px]"
          )}
        >
          <Suspense fallback={<SuspenseLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </MyErrorBoundary>
    </>
  );
}
