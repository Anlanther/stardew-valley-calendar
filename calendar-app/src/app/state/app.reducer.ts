import { createReducer, on } from '@ngrx/store';
import { CalendarState } from '../models/calendar-state.model';
import { Calendar } from '../models/calendar.model';
import { EventState } from '../models/event-state.model';
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
    }),
  ),
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
    activeFormEvents: [...action.calendarEvents],
  })),
  on(AppActions.updateYear, (state, action) => ({
    ...state,
    selectedYear: action.year,
  })),
  on(AppActions.updateSeason, (state, action) => ({
    ...state,
    selectedSeason: action.season,
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
          calendarEvents: [
            ...state.activeCalendar.calendarEvents,
            action.calendarEvent,
          ],
        }
      : null,
    activeFormEvents: state.activeFormEvents
      ? [...state.activeFormEvents, action.calendarEvent]
      : null,
  })),
  on(AppActions.deleteEventSuccess, (state, action) => ({
    ...state,
    activeCalendar: state.activeCalendar
      ? {
          ...state.activeCalendar,
          calendarEvents: state.activeCalendar?.calendarEvents.filter(
            (calendar) => calendar.id !== action.id,
          ),
        }
      : null,
    activeFormEvents: state.activeFormEvents
      ? state.activeFormEvents.filter((event) => event.id !== action.id)
      : null,
  })),
  on(AppActions.deleteCalendarSuccess, (state) => ({
    ...state,
    activeCalendar: null,
    activeFormEvents: null,
  })),
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
          calendarEvents: [
            ...state.activeCalendar?.calendarEvents.filter(
              (calendar) => calendar.id !== action.calendarEvent.id,
            ),
            action.calendarEvent,
          ],
        }
      : null,
    activeFormEvents: state.activeFormEvents
      ? [
          ...state.activeFormEvents.filter(
            (event) => event.id !== action.calendarEvent.id,
          ),
          action.calendarEvent,
        ]
      : null,
  })),
  on(AppActions.toggleNavBar, (state, action) => ({
    ...state,
    navBarOpen: action.isOpen,
  })),
);
