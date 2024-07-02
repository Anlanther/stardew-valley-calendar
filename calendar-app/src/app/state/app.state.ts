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
        available.filter((all) => (active ? all.id !== active.id : true))
    ),
  }),
});
