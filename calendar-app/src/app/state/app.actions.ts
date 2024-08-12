import { createActionGroup, emptyProps } from '@ngrx/store';
import { CalendarEvent } from '../models/calendar-event.model';
import { Calendar } from '../models/calendar.model';
import { Season } from '../models/season.model';
import { StatusMessage } from '../models/status-message.model';

export const AppActions = createActionGroup({
  source: 'App',
  events: {
    'Create Calendar': emptyProps(),
    'Update Calendar': emptyProps(),
    'Create Calendar Success': (calendar: Calendar) => ({ calendar }),
    'Get Calendars': emptyProps(),
    'Get Calendars Success': (calendars: Calendar[]) => ({ calendars }),
    'Update Active Calendar': (calendar: Calendar) => ({ calendar }),
    'Update Active Day': (day: number) => ({ day }),
    'Load Calendar': (id: string) => ({ id }),
    'Update Active Form Events': (calendarEvents: CalendarEvent[]) => ({
      calendarEvents,
    }),
    'Update Year': (year: number) => ({ year }),
    'Update Season': (season: Season) => ({ season }),
    'Delete Event': (id: string, name: string) => ({
      id,
      name,
    }),
    'Delete Event Success': (id: string) => ({ id }),
    'Delete Calendar': emptyProps(),
    'Delete Calendar Success': (id: string) => ({ id }),
    'Update Event': (calendarEvent: CalendarEvent) => ({
      calendarEvent,
    }),
    'Update Event Success': (calendarEvent: CalendarEvent) => ({
      calendarEvent,
    }),
    'Create Event': emptyProps(),
    'Create Event Success': (calendarEvent: CalendarEvent) => ({
      calendarEvent,
    }),
    'Added Event to Calendar': (calendar: Calendar) => ({ calendar }),
    'Update Status Message': (message: StatusMessage) => ({ message }),
    'Toggle Nav Bar': (isOpen: boolean) => ({ isOpen }),
    'Open Update Active Year Dialog': emptyProps(),
  },
});
