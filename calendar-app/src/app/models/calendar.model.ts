import { CalendarEvent } from './calendar-event.model';

export interface Calendar {
  id: string;
  name: string;
  calendarEvents: CalendarEvent[];
  publishedAt: string;
}
