import { createFeature, createSelector } from '@ngrx/store';
import { StatusMessage } from '../models/status-message.model';
import { EventUtils } from '../services/event.utils';
import { appReducer } from './app.reducer';

export const AppFeature = createFeature({
  name: 'app',
  reducer: appReducer,
  extraSelectors: (baseSelectors) => ({
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
    selectStatusMessage: createSelector(
      baseSelectors.selectApiFailed,
      baseSelectors.selectActiveCalendar,
      baseSelectors.selectAvailableCalendars,
      baseSelectors.selectOfflineMode,
      (apiFailed, hasSelectedCalendar, availableCalendars, offlineMode) => {
        const appNotReady = apiFailed && !offlineMode;

        if (appNotReady) {
          return StatusMessage.NO_API_ACCESS;
        } else if (availableCalendars.length === 0) {
          return StatusMessage.NO_CALENDARS_AVAILABLE;
        } else if (!hasSelectedCalendar) {
          return StatusMessage.NO_SELECTED_CALENDAR;
        }
        return StatusMessage.READY;
      },
    ),
  }),
});
