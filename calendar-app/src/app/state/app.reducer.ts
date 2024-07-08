import { createReducer, on } from '@ngrx/store';
import { CalendarState } from '../models/calendar-state.model';
import { Calendar } from '../models/calendar.model';
import { EventState } from '../models/event-state.model';
import { Season } from '../models/season.model';
import { AppActions } from './app.actions';

export interface AppState {
  activeCalendar: CalendarState;
  activeFormEvents: EventState;
  selectedYear: number;
  selectedDay: number;
  selectedSeason: Season;
  availableCalendars: Calendar[];
  isLoading: boolean;
}

export const initialState: AppState = {
  activeCalendar: null,
  activeFormEvents: null,
  selectedYear: 1,
  selectedDay: 1,
  selectedSeason: Season.SPRING,
  availableCalendars: [],
  isLoading: false,
};

export const appReducer = createReducer<AppState>(
  initialState,
  on(
    AppActions.createCalendarSuccess,
    AppActions.updateActiveCalendar,
    (state, action) => ({
      ...state,
      activeCalendar: action.calendar,
    }),
  ),
  on(AppActions.getCalendarsSuccess, (state, action) => ({
    ...state,
    availableCalendars: action.calendars,
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
);
