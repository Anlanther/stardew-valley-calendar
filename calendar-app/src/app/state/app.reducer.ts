import { createReducer, on } from '@ngrx/store';
import { CalendarState } from '../models/calendar-state.model';
import { Calendar } from '../models/calendar.model';
import { EventState } from '../models/event-state.model';
import { GameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { SelectedDate } from '../models/selected-date.model';
import { StatusMessage } from '../models/status-message.model';
import { EventUtils } from '../services/event.utils';
import { AppActions } from './app.actions';

export interface AppState {
  activeCalendar: CalendarState;
  activeFormEvents: EventState;
  selectedDate: SelectedDate;
  availableCalendars: Calendar[];
  savedSystemEvents: GameEvent[];
  statusMessage: StatusMessage;
  navBarOpen: boolean;
}

export const initialState: AppState = {
  activeCalendar: null,
  activeFormEvents: null,
  selectedDate: { day: 1, year: 1, season: Season.SPRING },
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
  on(AppActions.updateSeason, (state, action) => ({
    ...state,
    selectedDate: { ...state.selectedDate, season: action.season },
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
    selectedDate: { ...state.selectedDate, day: action.day },
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
  on(AppActions.updateCalendarSuccess, (state, action) => {
    const regexString = EventUtils.getEventRegex(
      action.calendar.systemConfig.includeBirthdays,
      action.calendar.systemConfig.includeCrops,
      action.calendar.systemConfig.includeFestivals,
    );
    const filteredGameEvents = action.calendar.gameEvents.filter(
      (event) =>
        new RegExp(regexString).test(event.type) || event.type.includes('user'),
    );
    return {
      ...state,
      activeCalendar: { ...action.calendar, filteredGameEvents },
      selectedDate: { ...state.selectedDate, year: action.year },
    };
  }),
);
