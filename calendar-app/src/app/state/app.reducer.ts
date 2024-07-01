import { createReducer } from '@ngrx/store';
import { CalendarState } from '../models/calendar-state.model';
import { Season } from '../models/season.model';

export interface AppState {
  activeCalendar: CalendarState;
  selectedYear: number;
  selectedDay: number;
  selectedSeason: Season;
}

export const initialState: AppState = {
  activeCalendar: null,
  selectedYear: 1,
  selectedDay: 1,
  selectedSeason: Season.FALL,
};

export const appReducer = createReducer<AppState>(initialState);
