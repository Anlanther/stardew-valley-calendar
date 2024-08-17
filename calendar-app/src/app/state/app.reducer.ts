import { createReducer, on } from '@ngrx/store';
import { CalendarState } from '../models/calendar-state.model';
import { Calendar } from '../models/calendar.model';
import { EventState } from '../models/event-state.model';
import { GameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { StatusMessage } from '../models/status-message.model';
import { AppActions } from './app.actions';

export interface AppState {
  activeCalendar: CalendarState;
  activeFormEvents: EventState;
  selectedYear: number;
  selectedDay: number;
  selectedSeason: Season;
  availableCalendars: Calendar[];
  savedSystemEvents: GameEvent[];
  statusMessage: StatusMessage;
  navBarOpen: boolean;
}

export const initialState: AppState = {
  activeCalendar: null,
  activeFormEvents: null,
  selectedYear: 1,
  selectedDay: 1,
  selectedSeason: Season.SPRING,
  availableCalendars: [],
  savedSystemEvents: [],
  statusMessage: StatusMessage.NO_API_ACCESS,
  navBarOpen: false,
};

export const appReducer = createReducer<AppState>(
  initialState,
  on(
    AppActions.createCalendarSuccess,
    AppActions.updateActiveCalendar,
    (state, action) => ({
      ...state,
      activeCalendar: action.calendar,
      statusMessage: StatusMessage.READY,
      navBarOpen: false,
    }),
  ),
  on(AppActions.createCalendarSuccess, (state, action) => ({
    ...state,
    activeCalendar: action.calendar,
    availableCalendars: [...state.availableCalendars, action.calendar],
    statusMessage: StatusMessage.READY,
  })),
  on(AppActions.getCalendarsSuccess, (state, action) => ({
    ...state,
    availableCalendars: action.calendars,
    statusMessage:
      action.calendars.length === 0
        ? StatusMessage.NO_CALENDARS_AVAILABLE
        : StatusMessage.NO_SELECTED_CALENDAR,
  })),
  on(AppActions.updateActiveFormEvents, (state, action) => ({
    ...state,
    activeFormEvents: [...action.gameEvents],
  })),
  on(AppActions.updateYear, (state, action) => ({
    ...state,
    selectedYear: action.year,
    navBarOpen: false,
  })),
  on(AppActions.updateSeason, (state, action) => ({
    ...state,
    selectedSeason: action.season,
    navBarOpen: false,
  })),
  on(AppActions.addedEventToCalendar, (state, action) => ({
    ...state,
    activeCalendar: action.calendar,
  })),
  on(AppActions.createEventSuccess, (state, action) => ({
    ...state,
    activeCalendar: state.activeCalendar
      ? {
          ...state.activeCalendar,
          gameEvents: [...state.activeCalendar.gameEvents, action.gameEvent],
        }
      : null,
    activeFormEvents: state.activeFormEvents
      ? [...state.activeFormEvents, action.gameEvent]
      : null,
  })),
  on(AppActions.deleteEventSuccess, (state, action) => ({
    ...state,
    activeCalendar: state.activeCalendar
      ? {
          ...state.activeCalendar,
          gameEvents: state.activeCalendar?.gameEvents.filter(
            (calendar) => calendar.id !== action.id,
          ),
        }
      : null,
    activeFormEvents: state.activeFormEvents
      ? state.activeFormEvents.filter((event) => event.id !== action.id)
      : null,
  })),
  on(AppActions.deleteCalendarSuccess, (state, action) => {
    const updatedAvailableCalendars = state.availableCalendars.filter(
      (calendar) => calendar.id !== action.id,
    );
    return {
      ...state,
      activeCalendar: null,
      activeFormEvents: null,
      availableCalendars: updatedAvailableCalendars,
      statusMessage:
        updatedAvailableCalendars.length === 0
          ? StatusMessage.NO_CALENDARS_AVAILABLE
          : StatusMessage.NO_SELECTED_CALENDAR,
    };
  }),
  on(AppActions.updateActiveDay, (state, action) => ({
    ...state,
    selectedDay: action.day,
  })),
  on(AppActions.updateStatusMessage, (state, action) => ({
    ...state,
    statusMessage: action.message,
  })),
  on(AppActions.updateEventSuccess, (state, action) => ({
    ...state,
    activeCalendar: state.activeCalendar
      ? {
          ...state.activeCalendar,
          gameEvents: [
            ...state.activeCalendar?.gameEvents.filter(
              (calendar) => calendar.id !== action.gameEvent.id,
            ),
            action.gameEvent,
          ],
        }
      : null,
    activeFormEvents: state.activeFormEvents
      ? [
          ...state.activeFormEvents.filter(
            (event) => event.id !== action.gameEvent.id,
          ),
          action.gameEvent,
        ]
      : null,
  })),
  on(AppActions.toggleNavBar, (state, action) => ({
    ...state,
    navBarOpen: action.isOpen,
  })),
  on(AppActions.createDefaultGameEventsSuccess, (state, action) => ({
    ...state,
    savedSystemEvents: action.systemEvents,
  })),
);
