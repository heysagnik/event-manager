// dashboard.tsx
"use client";
import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useEvents, EventsProvider } from "../hooks/use-events";
import { format } from "date-fns";
import { EventCard } from "@/components/EventCard"; // Import EventCard component

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface PageProps {
  user: User;
}

const PageContent = ({ user }: PageProps) => {
  const { events, fetchEvents } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Fetch events when the component mounts
  useEffect(() => {
    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      fetchEvents(dateString);
    }
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateString = format(date, "yyyy-MM-dd");
    fetchEvents(dateString);
  };

  const openCopilotPopup = () => {
    setIsCopilotOpen(true);
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar user={user} onDateSelect={handleDateSelect} />
        <SidebarInset>
          <header className="sticky top-0 flex h-16 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {selectedDate
                      ? selectedDate.toDateString()
                      : "Select a date"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {events.length === 0 ? (
              <div className="flex flex-1 justify-center items-center">
                <Image
                  src="/download.png"
                  alt="No events"
                  width={300}
                  height={300}
                />
                <div className="flex flex-col gap-4 p-4">
                  <h1 className="text-4xl font-bold">No events</h1>
                  <h1 className="text-4xl font-bold">
                    scheduled for the day
                  </h1>
                  <button
                    className="bg-primary text-white p-2 rounded-lg"
                    onClick={openCopilotPopup}
                  >
                    Schedule now
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>

      {isCopilotOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <CopilotPopup
            defaultOpen
            clickOutsideToClose
            onSetOpen={(open) => setIsCopilotOpen(open)}
          />
        </div>
      )}
    </>
  );
};

const Page = ({ user }: PageProps) => (
  <EventsProvider>
    <PageContent user={user} />
  </EventsProvider>
);

export default Page;