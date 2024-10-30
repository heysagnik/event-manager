'use client';

import { Calendar } from "@/components/ui/calendar";
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import React from "react";

interface DatePickerProps {
  onDateSelect: (date: Date) => void;
}

// date-picker.tsx

export function DatePicker({ onDateSelect }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>(new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onDateSelect(selectedDate);
    }
  };

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}