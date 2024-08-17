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
      baseSelectors.selectSelectedSeason,
      baseSelectors.selectSelectedDay,
      (season, day) =>
        `${day} ${season[0].toUpperCase() + season.substring(1)}`,
    ),
    selectNavTitle: createSelector(
      baseSelectors.selectActiveCalendar,
      baseSelectors.selectSelectedYear,
      (calendar, year) => `${calendar?.name}, year ${year}`,
    ),
    selectCalendarSeasonEvents: createSelector(
      baseSelectors.selectActiveCalendar,
      baseSelectors.selectSelectedYear,
      baseSelectors.selectSelectedSeason,
      (calendar, year, season) =>
        calendar ? EventDateUtils.getEventsForDate(season, year, calendar) : [],
    ),
    selectIsDateSelected: createSelector(
      baseSelectors.selectNavBarOpen,
      baseSelectors.selectSelectedDay,
      (navBarOpen, day) => ({ navBarOpen, day }),
    ),
  }),
});
