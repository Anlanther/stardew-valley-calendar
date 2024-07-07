import { createFeature, createSelector } from '@ngrx/store';
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
      baseSelectors.selectSelectedYear,
      baseSelectors.selectSelectedSeason,
      baseSelectors.selectSelectedDay,
      (year, season, day) =>
        `${day} ${season[0].toUpperCase() + season.substring(1)}, ${year}`,
    ),
  }),
});
