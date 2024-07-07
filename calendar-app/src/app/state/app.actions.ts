import { createActionGroup, emptyProps } from '@ngrx/store';
import { CalendarEvent } from '../models/calendar-event.model';
import { Calendar } from '../models/calendar.model';

export const AppActions = createActionGroup({
  source: 'App',
  events: {
    'Create Calendar': emptyProps(),
    'Edit Calendar': emptyProps(),
    'Create Calendar Success': (calendar: Calendar) => ({ calendar }),
    'Get Calendars': emptyProps(),
    'Get Calendars Success': (calendars: Calendar[]) => ({ calendars }),
    'Update Active Calendar': (calendar: Calendar) => ({ calendar }),
    'Load Calendar': (id: string) => ({ id }),
    'Update Active Events': (calendarEvents: CalendarEvent[]) => ({
      calendarEvents,
    }),
  },
});
