import { createReducer, on } from '@ngrx/store';
import { CalendarState } from '../models/calendar-state.model';
import { Calendar } from '../models/calendar.model';
import { EventState } from '../models/event-state.model';
import { GameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { SelectedDate } from '../models/selected-date.model';
import { CalendarUtils } from '../services/calendar.utils';
import { AppActions } from './app.actions';

export interface AppState {
  activeCalendar: CalendarState;
  activeDayEvents: EventState;
  activeSeasonGoals: GameEvent[];
  selectedDate: SelectedDate;
  availableCalendars: Calendar[];
  savedSystemEvents: GameEvent[];
  apiFailed: boolean;
  eventNavOpen: boolean;
  seasonNavOpen: boolean;
  offlineMode: boolean;
}

export const initialState: AppState = {
  activeCalendar: null,
  activeDayEvents: null,
  activeSeasonGoals: [],
  selectedDate: { day: 1, year: 1, season: Season.SPRING },
  availableCalendars: [],
  savedSystemEvents: [],
  apiFailed: false,
  eventNavOpen: false,
  seasonNavOpen: false,
  offlineMode: false,
};

export const appReducer = createReducer<AppState>(
  initialState,
  on(AppActions.createCalendarSuccess, (state, action) => {
    const filteredGameEvents = CalendarUtils.getFilteredSystemEvents(
      action.calendar.systemConfig.includeBirthdays,
      action.calendar.systemConfig.includeCrops,
      action.calendar.systemConfig.includeFestivals,
      [...state.savedSystemEvents, ...action.calendar.gameEvents],
    );
    const activeSeasonGoals = CalendarUtils.getEventsForDate(
      initialState.selectedDate.season,
      initialState.selectedDate.year,
      action.calendar,
      0,
    );

    return {
      ...state,
      activeCalendar: { ...action.calendar, filteredGameEvents },
      availableCalendars: [...state.availableCalendars, action.calendar],
      activeSeasonGoals,
      selectedDate: initialState.selectedDate,
      eventNavOpen: false,
      seasonNavOpen: false,
    };
  }),
  on(AppActions.updateActiveCalendar, (state, action) => {
    const filteredGameEvents = CalendarUtils.getFilteredSystemEvents(
      action.calendar.systemConfig.includeBirthdays,
      action.calendar.systemConfig.includeCrops,
      action.calendar.systemConfig.includeFestivals,
      [...state.savedSystemEvents, ...action.calendar.gameEvents],
    );

    return {
      ...state,
      activeCalendar: { ...action.calendar, filteredGameEvents },
      availableCalendars: [...state.availableCalendars],
      eventNavOpen: false,
      seasonNavOpen: false,
    };
  }),
  on(AppActions.getCalendarsSuccess, (state, action) => ({
    ...state,
    availableCalendars: action.calendars,
  })),
  on(AppActions.updateActiveDayEvents, (state, action) => ({
    ...state,
    activeDayEvents: [...action.gameEvents],
  })),
  on(AppActions.updateSeason, (state, action) => ({
    ...state,
    selectedDate: { ...state.selectedDate, season: action.season },
    eventNavOpen: false,
    seasonNavOpen: false,
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
    activeDayEvents: state.activeDayEvents
      ? [...state.activeDayEvents, action.gameEvent]
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
  on(AppActions.addedGoalToCalendar, (state, action) => ({
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
    availableCalendars: [
      ...state.availableCalendars.filter(
        (calendar) => calendar.id !== action.calendar.id,
      ),
      {
        ...action.calendar,
        gameEvents: [...action.calendar.gameEvents],
      },
    ],
    activeSeasonGoals: [...state.activeSeasonGoals, action.gameEvent],
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
    activeDayEvents: state.activeDayEvents
      ? state.activeDayEvents.filter((event) => event.id !== action.id)
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
  on(AppActions.deleteGoalSuccess, (state, action) => ({
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
    activeSeasonGoals: state.activeSeasonGoals.filter(
      (event) => event.id !== action.id,
    ),
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
      activeDayEvents: null,
      activeSeasonGoals: [],
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
    activeDayEvents: state.activeDayEvents
      ? [
          ...state.activeDayEvents.filter(
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
  on(AppActions.updateGoalSuccess, (state, action) => ({
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
    activeSeasonGoals: [
      ...state.activeSeasonGoals.filter(
        (event) => event.id !== action.gameEvent.id,
      ),
      action.gameEvent,
    ],
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
  on(AppActions.toggleEventNav, (state, action) => ({
    ...state,
    eventNavOpen: action.isOpen,
  })),
  on(AppActions.createDefaultGameEventsSuccess, (state, action) => ({
    ...state,
    savedSystemEvents: action.systemEvents,
  })),
  on(AppActions.updateCalendarSuccess, (state, action) => {
    const filteredGameEvents = CalendarUtils.getFilteredSystemEvents(
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
      eventNavOpen: false,
      seasonNavOpen: false,
    };
  }),
  on(AppActions.aPIFailed, (state, action) => ({
    ...state,
    apiFailed: action.failed,
  })),
  on(AppActions.setOfflineMode, (state) => ({
    ...state,
    offlineMode: true,
  })),
  on(AppActions.toggleSeasonNav, (state, action) => ({
    ...state,
    seasonNavOpen: action.isOpen,
  })),
  on(AppActions.updateActiveSeasonGoals, (state) => {
    const filteredSeasonGoals = CalendarUtils.getEventsForDate(
      state.selectedDate.season,
      state.selectedDate.year,
      state.activeCalendar!,
      0,
    );
    return {
      ...state,
      activeSeasonGoals: filteredSeasonGoals,
    };
  }),
);
