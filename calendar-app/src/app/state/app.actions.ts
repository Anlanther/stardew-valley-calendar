import { createActionGroup, emptyProps } from '@ngrx/store';
import { Calendar } from '../models/calendar.model';
import { DownloadedCalendar } from '../models/downloaded-calendar.model';
import { GameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';

export const AppActions = createActionGroup({
  source: 'App',
  events: {
    'Create Calendar': emptyProps(),
    'Select Calendar': emptyProps(),
    'Update Calendar': emptyProps(),
    'Update Calendar Success': (calendar: Calendar, year: number) => ({
      calendar,
      year,
    }),
    'Create Calendar Success': (calendar: Calendar) => ({ calendar }),
    'Get Calendars': emptyProps(),
    'Get Calendars Success': (calendars: Calendar[]) => ({ calendars }),
    'Update Active Calendar': (calendar: Calendar) => ({ calendar }),
    'Update Active Day': (day: number) => ({ day }),
    'Load Calendar': (id: string) => ({ id }),
    'Update Active Form Events': (gameEvents: GameEvent[]) => ({
      gameEvents,
    }),
    'Update Season': (season: Season) => ({ season }),
    'Delete Event': (id: string, name: string) => ({
      id,
      name,
    }),
    'Delete Calendar Game Events': (
      calendarId: string,
      eventIds: string[],
    ) => ({
      calendarId,
      eventIds,
    }),
    'Create Default Game Events': emptyProps(),
    'Create Default Game Events Success': (systemEvents: GameEvent[]) => ({
      systemEvents,
    }),
    'Delete Event Success': (id: string) => ({ id }),
    'Delete Calendar': emptyProps(),
    'Delete Calendar Success': (id: string) => ({ id }),
    'Update Event': (gameEvent: GameEvent) => ({
      gameEvent,
    }),
    'Update Event Success': (gameEvent: GameEvent) => ({
      gameEvent,
    }),
    'Create Event': emptyProps(),
    'Create Event Success': (gameEvent: GameEvent) => ({
      gameEvent,
    }),
    'Added Event to Calendar': (calendar: Calendar, gameEvent: GameEvent) => ({
      calendar,
      gameEvent,
    }),
    'API Failed': emptyProps(),
    'Toggle Nav Bar': (isOpen: boolean) => ({ isOpen }),
    Initialise: emptyProps(),
    'Create Uploaded Calendar': (downloadedCalendar: DownloadedCalendar) => ({
      downloadedCalendar,
    }),
    'Create Uploaded Calendar Base Success': (
      calendar: Calendar,
      gameEventsToAdd: GameEvent[],
    ) => ({
      calendar,
      gameEventsToAdd,
    }),
    'Create Uploaded Calendar Events Success': (
      calendar: Calendar,
      gameEventsToAdd: GameEvent[],
    ) => ({
      calendar,
      gameEventsToAdd,
    }),
    'Update System Events': emptyProps(),
    'Updated System Events Success': emptyProps(),
    'Set Token': emptyProps(),
    'Set Token Success': (token: string) => ({ token }),
    'Set Offline Mode': emptyProps(),
  },
});
