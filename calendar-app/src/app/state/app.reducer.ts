import { createReducer, on } from '@ngrx/store';
import { CalendarState } from '../models/calendar-state.model';
import { Calendar } from '../models/calendar.model';
import { EventState } from '../models/event-state.model';
import { Season } from '../models/season.model';
import { Tag } from '../models/tag.model';
import { AppActions } from './app.actions';

const IS_TESTING = true;

const TESTING_CALENDAR: Calendar = {
  id: '5',
  name: '1',
  publishedAt: '',
  calendarEvents: [
    {
      id: '1',
      title: '1',
      description: 'A description',
      tag: Tag.Abigail,
      publishedAt: '',
      gameDate: {
        id: '7',
        day: 1,
        isRecurring: false,
        season: Season.SPRING,
        year: 1,
      },
    },
  ],
};

export interface AppState {
  activeCalendar: CalendarState;
  activeFormEvents: EventState;
  selectedYear: number;
  selectedDay: number;
  selectedSeason: Season;
  availableCalendars: Calendar[];
}

export const initialState: AppState = {
  activeCalendar: IS_TESTING ? TESTING_CALENDAR : null,
  activeFormEvents: null,
  selectedYear: 1,
  selectedDay: 1,
  selectedSeason: Season.SPRING,
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
  on(AppActions.addedEventToCalendar, (state, action) => ({
    ...state,
    activeCalendar: action.calendar,
  })),
);
