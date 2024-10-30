// use-events.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { isBefore, parseISO } from "date-fns";

interface Event {
  id?: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  guests: number;
  guestList: string[];
  customization: string;
  catering: string;
  services: string[];
}

interface EventsContextType {
  events: Event[];
  addEvent: (event: Event) => Promise<void>;
  fetchEvents: (date: string) => Promise<Event[]>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  // Make the events state readable by Copilot
  useCopilotReadable({
    description: "The state of the events list",
    value: JSON.stringify(events),
  });

  const addEvent = async (event: Event): Promise<void> => {
    try {
      const docRef = await addDoc(collection(db, "events"), event);
      setEvents((prevEvents) => [...prevEvents, { ...event, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const fetchEvents = async (date: string): Promise<Event[]> => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("date", "==", date));
      const querySnapshot = await getDocs(q);

      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      setEvents(eventsData);
      return eventsData;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };

  // Add Event Copilot Action
  useCopilotAction({
    name: "addEventWithDateTime",
    description: "Adds an event after selecting date and time",
    parameters: [
      {
        name: "date",
        type: "string",
        description: "Event date (YYYY-MM-DD)",
        required: true,
      },
      {
        name: "time",
        type: "string",
        description: "Event time (HH:mm)",
        required: true,
      },
      {
        name: "eventType",
        type: "string",
        description: "Type of the event (e.g., Birthday, Meeting)",
        required: true,
      },
    ],
    handler: async ({ date, time, eventType }) => {
      const eventDateTime = parseISO(`${date}T${time}:00`);
      const now = new Date();

      if (isBefore(eventDateTime, now)) {
        throw new Error("Cannot add an event in the past.");
      }

      const event: Event = {
        type: eventType,
        date,
        time,
        venue: "Venue A",
        guests: 50,
        guestList: ["Guest 1", "Guest 2", "Guest 3"],
        customization: "Custom decorations",
        catering: "Full course meal",
        services: ["Photography", "Music"],
      };
      await addEvent(event);
      return event;
    },
    render: ({ status, result, error }:any) => {
      if (status === "executing" || status === "inProgress") {
        return <div>Adding event...</div>;
      } else if (status === "complete" && result) {
        return (
          <div>
            Event added: {result.type} on {result.date} at {result.time}
          </div>
        );
      } else if (error) {
        return <div className="text-red-500">{error.message}</div>;
      } else {
        return <div className="text-red-500">Failed to add event</div>;
      }
    },
  });

  // Fetch Events Copilot Action
  useCopilotAction({
    name: "fetchEventsForDate",
    description: "Fetches events for a specific date",
    parameters: [
      {
        name: "date",
        type: "string",
        description: "Date to fetch events for (YYYY-MM-DD)",
        required: true,
      },
    ],
    handler: async ({ date }) => {
      const eventsData = await fetchEvents(date);
      return { eventsData, date };
    },
    render: ({ status, result }) => {
      if (status === "executing" || status === "inProgress") {
        return <div>Fetching events...</div>;
      } else if (status === "complete" && result && result.eventsData.length > 0) {
        const { eventsData, date } = result;
        return (
          <div>
            <h2>Events on {date}</h2>
            {eventsData.map((event: Event) => (
              <div key={event.id}>
                {event.type} at {event.time}
              </div>
            ))}
          </div>
        );
      } else {
        return <div>No events found for this date.</div>;
      }
    },
  });

  return (
    <EventsContext.Provider value={{ events, addEvent, fetchEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};