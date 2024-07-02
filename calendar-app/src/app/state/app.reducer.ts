import { createReducer, on } from '@ngrx/store';
import { CalendarState } from '../models/calendar-state.model';
import { Calendar } from '../models/calendar.model';
import { Season } from '../models/season.model';
import { AppActions } from './app.actions';

export interface AppState {
  activeCalendar: CalendarState;
  selectedYear: number;
  selectedDay: number;
  selectedSeason: Season;
  availableCalendars: Calendar[];
}

export const initialState: AppState = {
  activeCalendar: null,
  selectedYear: 1,
  selectedDay: 1,
  selectedSeason: Season.FALL,
  availableCalendars: [],
};

export const appReducer = createReducer<AppState>(
  initialState,
  on(
    AppActions.createCalendarSuccess,
    AppActions.updateActiveCalendar,
    (state, action) => ({
      ...state,
      activeCalendar: action.calendar,
    })
  ),
  on(AppActions.getCalendarsSuccess, (state, action) => ({
    ...state,
    availableCalendars: action.calendars,
  }))
);
