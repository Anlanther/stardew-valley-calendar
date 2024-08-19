import { createFeature, createSelector } from '@ngrx/store';
import { EventUtils } from '../services/event.utils';
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
    selectSelectedDateString: createSelector(
      baseSelectors.selectSelectedDate,
      (date) =>
        `${date.day} ${date.season[0].toUpperCase() + date.season.substring(1)}`,
    ),

    selectNavTitle: createSelector(
      baseSelectors.selectActiveCalendar,
      baseSelectors.selectSelectedDate,
      (calendar, date) => `${calendar?.name}, year ${date.year}`,
    ),
    selectCalendarSeasonEvents: createSelector(
      baseSelectors.selectActiveCalendar,
      baseSelectors.selectSelectedDate,
      (calendar, date) =>
        calendar
          ? EventUtils.getEventsForDate(date.season, date.year, calendar)
          : [],
    ),
    selectIsDateSelected: createSelector(
      baseSelectors.selectNavBarOpen,
      baseSelectors.selectSelectedDate,
      (navBarOpen, date) => ({ navBarOpen, day: date.day }),
    ),
  }),
});
