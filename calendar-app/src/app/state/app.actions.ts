import { createActionGroup, emptyProps } from '@ngrx/store';
import { CalendarEvent } from '../models/calendar-event.model';
import { Calendar } from '../models/calendar.model';
import { Season } from '../models/season.model';

export const AppActions = createActionGroup({
  source: 'App',
  events: {
    'Create Calendar': emptyProps(),
    'Update Calendar': emptyProps(),
    'Create Calendar Success': (calendar: Calendar) => ({ calendar }),
    'Get Calendars': emptyProps(),
    'Get Calendars Success': (calendars: Calendar[]) => ({ calendars }),
    'Update Active Calendar': (calendar: Calendar) => ({ calendar }),
    'Load Calendar': (id: string) => ({ id }),
    'Update Active Form Events': (calendarEvents: CalendarEvent[]) => ({
      calendarEvents,
    }),
    'Update Year': (year: number) => ({ year }),
    'Update Season': (season: Season) => ({ season }),
    'Delete Calendar Event': (id: string) => ({ id }),
    'Delete Calendar Success': emptyProps(),
    'Update Calendar Event': (calendarEvent: CalendarEvent) => ({
      calendarEvent,
    }),
    'Update Calendar Event Success': (calendarEvent: CalendarEvent) => ({
      calendarEvent,
    }),
    'Create Event': emptyProps(),
    'Create Event Success': (calendarEvent: CalendarEvent) => ({
      calendarEvent,
    }),
    'Added Event to Calendar': (calendar: Calendar) => ({ calendar }),
  },
});
