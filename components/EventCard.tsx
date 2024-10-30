// components/EventCard.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock10Icon, CalendarIcon, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

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

export const EventCard = ({ event }: { event: Event }) => {
  const formattedDate = format(new Date(event.date), "do MMM yyyy");

  return (
    <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg">
      <Link href="#" className="group" prefetch={false}>
        <Image
          src="/placeholder.svg"
          alt="Event Poster"
          width="400"
          height="200"
          className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
          style={{ aspectRatio: "400/200", objectFit: "cover" }}
        />
      </Link>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{event.type}</h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock10Icon className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{event.venue}</span>
          </div>
        </div>
        <Button size="lg" className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};