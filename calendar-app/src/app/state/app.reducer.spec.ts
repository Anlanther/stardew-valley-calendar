import { MOCK_CALENDARS } from '../../../tests/utils/mocks/calendars.mock';
import { MOCK_GAME_EVENTS } from '../../../tests/utils/mocks/game-events.mock';
import { Season } from '../models/season.model';
import { AppActions } from './app.actions';
import { appReducer, AppState, initialState } from './app.reducer';

describe('AppReducer', () => {
  let state: AppState;

  beforeEach(() => {
    state = initialState;
  });

  describe(AppActions.createCalendarSuccess.type, () => {
    it('should update the state', () => {
      const mockCreatedCalendar = MOCK_CALENDARS[0];
      const action = AppActions.createCalendarSuccess(mockCreatedCalendar);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.updateActiveCalendar.type, () => {
    it('should update the state', () => {
      const mockNewlySelectedCalendar = MOCK_CALENDARS[0];
      const action = AppActions.updateActiveCalendar(mockNewlySelectedCalendar);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.getCalendarsSuccess.type, () => {
    it('should update the state', () => {
      const mockAllAvailableCalendars = MOCK_CALENDARS;
      const action = AppActions.getCalendarsSuccess(mockAllAvailableCalendars);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.updateActiveDayEvents.type, () => {
    it('should update the state', () => {
      const mockGameEventsOnSelectedDate = MOCK_GAME_EVENTS;
      const action = AppActions.updateActiveDayEvents(
        mockGameEventsOnSelectedDate,
      );

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.updateActiveSeasonGoals.type, () => {
    it('should update the state', () => {
      state.activeCalendar = MOCK_CALENDARS[0];
      const action = AppActions.updateActiveSeasonGoals();

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.updateSeason.type, () => {
    it('should update the state', () => {
      const mockSelectedSeason = Season.FALL;
      const action = AppActions.updateSeason(mockSelectedSeason);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.addedEventToCalendar.type, () => {
    it('should update the state', () => {
      const mockEvent = MOCK_GAME_EVENTS[0];
      const mockCalendarToAddEventTo = MOCK_CALENDARS[0];
      const action = AppActions.addedEventToCalendar(
        mockCalendarToAddEventTo,
        mockEvent,
      );

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.addedGoalToCalendar.type, () => {
    it('should update the state', () => {
      const mockGoal = MOCK_GAME_EVENTS[0];
      const mockCalendarToAddEventTo = MOCK_CALENDARS[0];
      const action = AppActions.addedGoalToCalendar(
        mockCalendarToAddEventTo,
        mockGoal,
      );

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.deleteEventSuccess.type, () => {
    it('should update the state', () => {
      const mockDeletedGameId = MOCK_GAME_EVENTS[0].id;
      const action = AppActions.deleteEventSuccess(mockDeletedGameId);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.deleteGoalSuccess.type, () => {
    it('should update the state', () => {
      const mockDeletedGoalId = MOCK_CALENDARS[0].id;
      const action = AppActions.deleteGoalSuccess(mockDeletedGoalId);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.deleteCalendarSuccess.type, () => {
    it('should update the state', () => {
      const mockDeletedCalendarId = MOCK_CALENDARS[0].id;
      const action = AppActions.deleteCalendarSuccess(mockDeletedCalendarId);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.updateActiveDay.type, () => {
    it('should update the state', () => {
      const mockSelectedDay = 2;
      const action = AppActions.updateActiveDay(mockSelectedDay);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.updateEventSuccess.type, () => {
    it('should update the state', () => {
      const mockGameEventUpdated = MOCK_GAME_EVENTS[0];
      const action = AppActions.updateEventSuccess(mockGameEventUpdated);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.updateGoalSuccess.type, () => {
    it('should update the state', () => {
      const mockGameEventUpdated = MOCK_GAME_EVENTS[0];
      const action = AppActions.updateGoalSuccess(mockGameEventUpdated);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.toggleEventNav.type, () => {
    it('should update the state', () => {
      const isToggleOpen = true;
      const action = AppActions.toggleEventNav(isToggleOpen);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.toggleSeasonNav.type, () => {
    it('should update the state', () => {
      const isToggleOpen = true;
      const action = AppActions.toggleSeasonNav(isToggleOpen);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.createDefaultGameEventsSuccess.type, () => {
    it('should update the state', () => {
      const mockSystemEvents = MOCK_GAME_EVENTS;
      const action =
        AppActions.createDefaultGameEventsSuccess(mockSystemEvents);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.updateCalendarSuccess.type, () => {
    it('should update the state', () => {
      const mockCalendarWithUpdatedDetails = MOCK_CALENDARS[0];
      const mockUpdatedYear = 2;
      const action = AppActions.updateCalendarSuccess(
        mockCalendarWithUpdatedDetails,
        mockUpdatedYear,
      );

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.aPIFailed.type, () => {
    it('should update the state', () => {
      const action = AppActions.aPIFailed(true);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.setOfflineMode.type, () => {
    it('should update the state', () => {
      const action = AppActions.setOfflineMode();

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
});
