import { createReducer, on } from '@ngrx/store';
import { CalendarState } from '../models/calendar-state.model';
import { Calendar } from '../models/calendar.model';
import { EventState } from '../models/event-state.model';
import { GameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { SelectedDate } from '../models/selected-date.model';
import { EventUtils } from '../services/event.utils';
import { AppActions } from './app.actions';

export interface AppState {
  activeCalendar: CalendarState;
  activeFormEvents: EventState;
  selectedDate: SelectedDate;
  availableCalendars: Calendar[];
  savedSystemEvents: GameEvent[];
  apiFailed: boolean;
  navBarOpen: boolean;
  offlineMode: boolean;
}

export const initialState: AppState = {
  activeCalendar: null,
  activeFormEvents: null,
  selectedDate: { day: 1, year: 1, season: Season.SPRING },
  availableCalendars: [],
  savedSystemEvents: [],
  apiFailed: false,
  navBarOpen: false,
  offlineMode: false,
};

export const appReducer = createReducer<AppState>(
  initialState,
  on(AppActions.createCalendarSuccess, (state, action) => {
    const filteredGameEvents = EventUtils.getFilteredSystemEvents(
      action.calendar.systemConfig.includeBirthdays,
      action.calendar.systemConfig.includeCrops,
      action.calendar.systemConfig.includeFestivals,
      [...state.savedSystemEvents, ...action.calendar.gameEvents],
    );

    return {
      ...state,
      activeCalendar: { ...action.calendar, filteredGameEvents },
      availableCalendars: [...state.availableCalendars, action.calendar],
      selectedDate: initialState.selectedDate,
      navBarOpen: false,
    };
  }),
  on(AppActions.updateActiveCalendar, (state, action) => {
    const filteredGameEvents = EventUtils.getFilteredSystemEvents(
      action.calendar.systemConfig.includeBirthdays,
      action.calendar.systemConfig.includeCrops,
      action.calendar.systemConfig.includeFestivals,
      [...state.savedSystemEvents, ...action.calendar.gameEvents],
    );

    return {
      ...state,
      activeCalendar: { ...action.calendar, filteredGameEvents },
      availableCalendars: [...state.availableCalendars],
      navBarOpen: false,
    };
  }),
  on(AppActions.getCalendarsSuccess, (state, action) => ({
    ...state,
    availableCalendars: action.calendars,
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
    activeCalendar: state.activeCalendar
      ? {
          ...state.activeCalendar,
          gameEvents: [...state.activeCalendar.gameEvents, action.gameEvent],
          filteredGameEvents: [
            ...state.activeCalendar.filteredGameEvents,
            action.gameEvent,
          ],
        }
      : null,
    activeFormEvents: state.activeFormEvents
      ? [...state.activeFormEvents, action.gameEvent]
      : null,
    availableCalendars: [
      ...state.availableCalendars.filter(
        (calendar) => calendar.id !== action.calendar.id,
      ),
      {
        ...action.calendar,
        gameEvents: [...action.calendar.gameEvents],
      },
    ],
  })),
  on(AppActions.deleteEventSuccess, (state, action) => ({
    ...state,
    activeCalendar: state.activeCalendar
      ? {
          ...state.activeCalendar,
          gameEvents: state.activeCalendar?.gameEvents.filter(
            (calendar) => calendar.id !== action.id,
          ),
          filteredGameEvents: state.activeCalendar.filteredGameEvents.filter(
            (calendar) => calendar.id !== action.id,
          ),
        }
      : null,
    activeFormEvents: state.activeFormEvents
      ? state.activeFormEvents.filter((event) => event.id !== action.id)
      : null,
    availableCalendars: [
      ...state.availableCalendars.map((calendar) =>
        calendar.id !== state.activeCalendar!.id
          ? calendar
          : {
              ...calendar,
              gameEvents: calendar.gameEvents.filter(
                (event) => event.id !== action.id,
              ),
            },
      ),
    ],
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
    };
  }),
  on(AppActions.updateActiveDay, (state, action) => ({
    ...state,
    selectedDate: { ...state.selectedDate, day: action.day },
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
          filteredGameEvents: [
            ...state.activeCalendar?.filteredGameEvents.filter(
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
    availableCalendars: [
      ...state.availableCalendars.map((calendar) =>
        calendar.id !== state.activeCalendar!.id
          ? calendar
          : {
              ...calendar,
              gameEvents: [
                ...calendar.gameEvents.filter(
                  (event) => event.id !== action.gameEvent.id,
                ),
                action.gameEvent,
              ],
            },
      ),
    ],
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
    const filteredGameEvents = EventUtils.getFilteredSystemEvents(
      action.calendar.systemConfig.includeBirthdays,
      action.calendar.systemConfig.includeCrops,
      action.calendar.systemConfig.includeFestivals,
      [...state.savedSystemEvents, ...action.calendar.gameEvents],
    );
    return {
      ...state,
      activeCalendar: { ...action.calendar, filteredGameEvents },
      selectedDate: { ...state.selectedDate, year: action.year },
      availableCalendars: [
        ...state.availableCalendars.filter(
          (calendar) => calendar.id !== action.calendar.id,
        ),
        action.calendar,
      ],
    };
  }),
  on(AppActions.aPIFailed, (state) => ({
    ...state,
    apiFailed: true,
  })),
  on(AppActions.setOfflineMode, (state) => ({
    ...state,
    offlineMode: true,
  })),
);
