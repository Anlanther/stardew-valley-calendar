import { createFeature, createSelector } from '@ngrx/store';
import { EventDateUtils } from '../services/event-date.utils';
import { appReducer } from './app.reducer';

export const AppFeature = createFeature({
  name: 'app',
  reducer: appReducer,
  extraSelectors: (baseSelectors) => ({
    selectInactiveCalendars: createSelector(
      baseSelectors.selectAvailableCalendars,
      baseSelectors.selectActiveCalendar,
      (available, active) =>
        available.filter((all) => (active ? all.id !== active.id : true)),
    ),
    selectSelectedDate: createSelector(
      baseSelectors.selectActiveCalendar,
      baseSelectors.selectSelectedYear,
      baseSelectors.selectSelectedSeason,
      baseSelectors.selectSelectedDay,
      (calendar, year, season, day) =>
        `${calendar?.name}: ${day} ${season[0].toUpperCase() + season.substring(1)}, ${year}`,
    ),
    selectCalendarSeasonEvents: createSelector(
      baseSelectors.selectActiveCalendar,
      baseSelectors.selectSelectedYear,
      baseSelectors.selectSelectedSeason,
      (calendar, year, season) =>
        calendar ? EventDateUtils.getEventsForDate(season, year, calendar) : [],
    ),
  }),
});
