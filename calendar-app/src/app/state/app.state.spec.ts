import { MOCK_CALENDARS } from '../../../tests/mocks/calendars.mock';
import { MOCK_GAME_EVENTS } from '../../../tests/mocks/game-events.mock';
import { Calendar } from '../models/calendar.model';
import { GameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { SelectedDate } from '../models/selected-date.model';
import { StatusMessage } from '../models/status-message.model';
import { AppFeature } from './app.state';

describe('Extra Selectors', () => {
  describe('selectSelectedDateString', () => {
    it('should return string with day and season on it with correct case', () => {
      const mockSelectedDate: SelectedDate = {
        day: 1,
        season: Season.FALL,
        year: 2,
      };
      const expected = `1 Fall`;

      expect(
        AppFeature.selectSelectedDateString.projector(mockSelectedDate),
      ).toEqual(expected);
    });
  });

  describe('selectNavTitle', () => {
    it('should return string with the calendar name and selected year', () => {
      const mockActiveCalendar: Calendar = MOCK_CALENDARS[0];
      const mockSelectedDate: SelectedDate = {
        day: 1,
        season: Season.FALL,
        year: 2,
      };
      const expected = `${mockActiveCalendar.name}, year ${mockSelectedDate.year}`;

      expect(
        AppFeature.selectNavTitle.projector(
          mockActiveCalendar,
          mockSelectedDate,
        ),
      ).toEqual(expected);
    });
  });

  describe('selectCalendarSeasonEvents', () => {
    it('returns a list of game events depending on the selected calendar and date', () => {
      const mockRecurringGameEvent: GameEvent = {
        ...MOCK_GAME_EVENTS[0],
        gameDate: {
          id: '1',
          isRecurring: true,
          day: 13,
          season: Season.FALL,
        },
      };
      const mockGameEventPlain: GameEvent = {
        ...MOCK_GAME_EVENTS[0],
        gameDate: {
          id: '2',
          isRecurring: false,
          year: 2,
          day: 13,
          season: Season.FALL,
        },
      };
      const mockNotApplicableGameEvent: GameEvent = {
        ...MOCK_GAME_EVENTS[0],
        gameDate: {
          id: '3',
          isRecurring: false,
          year: 1,
          day: 11,
          season: Season.FALL,
        },
      };
      const mockSelectedDate: SelectedDate = {
        day: 13,
        season: Season.FALL,
        year: 2,
      };
      const mockActiveCalendar: Calendar = {
        ...MOCK_CALENDARS[0],
        filteredGameEvents: [
          mockRecurringGameEvent,
          mockGameEventPlain,
          mockNotApplicableGameEvent,
        ],
      };
      const expected = [mockRecurringGameEvent, mockGameEventPlain];

      expected.forEach((e) => {
        expect(
          AppFeature.selectCalendarSeasonEvents.projector(
            mockActiveCalendar,
            mockSelectedDate,
          ),
        ).toContain(e);
      });
    });
  });

  describe('selectIsDateSelected', () => {
    it('returns object with nav bar status and the current selected day', () => {
      const mockNavBarOpenStatus = false;
      const mockSelectedDate: SelectedDate = {
        day: 13,
        season: Season.FALL,
        year: 2,
      };

      const expected = {
        navBarOpen: mockNavBarOpenStatus,
        day: mockSelectedDate.day,
      };

      expect(
        AppFeature.selectIsDateSelected.projector(
          mockNavBarOpenStatus,
          mockSelectedDate,
        ),
      ).toEqual(expected);
    });
  });

  describe('selectStatusMessage', () => {
    it('returns status ready message when system and active calendar are loaded, there are no API issues, and when there are other calendars available', () => {
      const mockSelectApiFailed = false;
      const mockSelectSavedSystemEvents = MOCK_GAME_EVENTS;
      const mockSelectActiveCalendar = MOCK_CALENDARS[0];
      const mockSelectAvailableCalendars = MOCK_CALENDARS;

      const expected: StatusMessage = StatusMessage.READY;

      expect(
        AppFeature.selectStatusMessage.projector(
          mockSelectApiFailed,
          mockSelectActiveCalendar,
          mockSelectAvailableCalendars,
          mockSelectSavedSystemEvents,
        ),
      ).toEqual(expected);
    });

    it('returns status no calendars available message when system and active calendar are loaded, there are no API issues, but no other calendars available', () => {
      const mockSelectApiFailed = false;
      const mockSelectSavedSystemEvents = MOCK_GAME_EVENTS;
      const mockSelectActiveCalendar = MOCK_CALENDARS[0];
      const mockSelectAvailableCalendars: Calendar[] = [];

      const expected: StatusMessage = StatusMessage.NO_CALENDARS_AVAILABLE;

      expect(
        AppFeature.selectStatusMessage.projector(
          mockSelectApiFailed,
          mockSelectActiveCalendar,
          mockSelectAvailableCalendars,
          mockSelectSavedSystemEvents,
        ),
      ).toEqual(expected);
    });

    it('returns status no API access when the API returns with an error', () => {
      const mockSelectApiFailed = true;
      const mockSelectSavedSystemEvents = MOCK_GAME_EVENTS;
      const mockSelectActiveCalendar = MOCK_CALENDARS[0];
      const mockSelectAvailableCalendars = MOCK_CALENDARS;

      const expected: StatusMessage = StatusMessage.NO_API_ACCESS;

      expect(
        AppFeature.selectStatusMessage.projector(
          mockSelectApiFailed,
          mockSelectActiveCalendar,
          mockSelectAvailableCalendars,
          mockSelectSavedSystemEvents,
        ),
      ).toEqual(expected);
    });

    it('returns status no API access when system events do not load', () => {
      const mockSelectApiFailed = false;
      const mockSelectSavedSystemEvents: GameEvent[] = [];
      const mockSelectActiveCalendar = MOCK_CALENDARS[0];
      const mockSelectAvailableCalendars = MOCK_CALENDARS;

      const expected: StatusMessage = StatusMessage.NO_API_ACCESS;

      expect(
        AppFeature.selectStatusMessage.projector(
          mockSelectApiFailed,
          mockSelectActiveCalendar,
          mockSelectAvailableCalendars,
          mockSelectSavedSystemEvents,
        ),
      ).toEqual(expected);
    });

    it('returns status no selected when the user has not selected a calendar but there are calendars currently available', () => {
      const mockSelectApiFailed = false;
      const mockSelectSavedSystemEvents = MOCK_GAME_EVENTS;
      const mockSelectActiveCalendar = null;
      const mockSelectAvailableCalendars = MOCK_CALENDARS;

      const expected: StatusMessage = StatusMessage.NO_SELECTED_CALENDAR;

      expect(
        AppFeature.selectStatusMessage.projector(
          mockSelectApiFailed,
          mockSelectActiveCalendar,
          mockSelectAvailableCalendars,
          mockSelectSavedSystemEvents,
        ),
      ).toEqual(expected);
    });
  });
});
