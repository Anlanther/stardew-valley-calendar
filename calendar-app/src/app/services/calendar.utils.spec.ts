import { MOCK_CALENDARS } from '../../../tests/utils/mocks/calendars.mock';
import { MOCK_GAME_EVENTS } from '../../../tests/utils/mocks/game-events.mock';
import { Calendar } from '../models/calendar.model';
import { GameDate } from '../models/game-date.model';
import { GameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { Tag } from '../models/tag.model';
import { Type } from '../models/type.model';
import { CalendarUtils } from './calendar.utils';
import { GameDateComponent } from './models/GameDateComponent';

describe('CalendarUtils', () => {
  describe('getEventsForDate', () => {
    it('should return events for the correct season and year whether recurring or not', () => {
      const mockSelectedSeason = Season.WINTER;
      const mockSelectedYear = 4;
      const mockActiveCalendar: Calendar = {
        ...MOCK_CALENDARS[0],
        filteredGameEvents: MOCK_GAME_EVENTS,
      };
      const expected: GameEvent[] = [
        MOCK_GAME_EVENTS[2],
        MOCK_GAME_EVENTS[3],
        MOCK_GAME_EVENTS[4],
      ];

      const result = CalendarUtils.getEventsForDate(
        mockSelectedSeason,
        mockSelectedYear,
        mockActiveCalendar,
      );
      expect(result).toEqual(expected);
    });

    it('should return events for the correct season and year and day when passed', () => {
      const mockSelectedSeason = Season.WINTER;
      const mockSelectedYear = 3;
      const mockSelectedDay = 12;
      const mockActiveCalendar: Calendar = {
        ...MOCK_CALENDARS[0],
        filteredGameEvents: MOCK_GAME_EVENTS,
      };
      const expected: GameEvent[] = [MOCK_GAME_EVENTS[1]];

      const result = CalendarUtils.getEventsForDate(
        mockSelectedSeason,
        mockSelectedYear,
        mockActiveCalendar,
        mockSelectedDay,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('getGameDateUnion', () => {
    it('should transform a GameDateComponent with a non recurring year correctly into a GameDate object', () => {
      const mockGameDateComponent: GameDateComponent = {
        id: '1',
        day: 10,
        isRecurring: false,
        season: Season.SPRING,
        year: 2,
      };
      const expected: GameDate = {
        id: '1',
        day: 10,
        isRecurring: false,
        season: Season.SPRING,
        year: 2,
      };

      const result = CalendarUtils.getGameDateUnion(mockGameDateComponent);
      expect(result).toEqual(expected);
    });

    it('should return a GameDate without the year for recurring events', () => {
      const mockGameDateComponent: GameDateComponent = {
        id: '2',
        day: 12,
        isRecurring: true,
        season: Season.SPRING,
      };
      const expected: GameDate = {
        id: '2',
        day: 12,
        isRecurring: true,
        season: Season.SPRING,
      };

      const result = CalendarUtils.getGameDateUnion(mockGameDateComponent);
      expect(result).toEqual(expected);
    });
  });

  describe('getFilteredSystemEvents', () => {
    it('should filter events based on included types', () => {
      const mockSystemEvents: GameEvent[] = [
        {
          id: '1',
          title: "Abigail's Birthday",
          description: '',
          tag: Tag.Abigail,
          type: Type.SystemBirthdays,
          publishedAt: '',
          gameDate: {
            id: '337',
            season: Season.FALL,
            day: 13,
            isRecurring: true,
          },
        },
        {
          id: '2',
          title: 'LAST DAY: Blue Jazz',
          description: `Sells for 50g.\n7 days to harvest.`,
          tag: Tag.BlueJazz,
          publishedAt: '',
          gameDate: {
            id: '1',
            isRecurring: true,
            day: 21,
            season: Season.SPRING,
          },
          type: Type.SystemCrops,
        },
        {
          id: '3',
          title: 'Egg Festival',
          description:
            'Like other festivals, the event lasts for most of the day and consists of two parts: a social portion and an Egg Hunt activity to finish the day. To take part, enter Pelican Town Square between 9am and 2pm. (It is impossible to enter the town before 9am; attempting to enter will say that the event is still being set up.) The festival will end immediately after the Egg Hunt or if the player leaves the Town, returning them to The Farm at 10pm.',
          tag: Tag.Festival,
          publishedAt: '',
          gameDate: {
            id: '1',
            isRecurring: true,
            day: 13,
            season: Season.SPRING,
          },
          type: Type.SystemFestivals,
        },
      ];
      const mockSystemConfigs = [
        {
          includeBirthdays: true,
          includeCrops: false,
          includeFestivals: false,
          expected: [mockSystemEvents[0]],
        },
        {
          includeBirthdays: false,
          includeCrops: true,
          includeFestivals: false,
          expected: [mockSystemEvents[1]],
        },
        {
          includeBirthdays: false,
          includeCrops: false,
          includeFestivals: true,
          expected: [mockSystemEvents[2]],
        },
        {
          includeBirthdays: true,
          includeCrops: true,
          includeFestivals: true,
          expected: [...mockSystemEvents],
        },
        {
          includeBirthdays: false,
          includeCrops: false,
          includeFestivals: false,
          expected: [],
        },
      ];

      mockSystemConfigs.forEach((testConfig) => {
        const result = CalendarUtils.getFilteredSystemEvents(
          testConfig.includeBirthdays,
          testConfig.includeCrops,
          testConfig.includeFestivals,
          mockSystemEvents,
        );

        expect(result).toEqual(testConfig.expected);
      });
    });

    it('should return all user created events regardless of system config', () => {
      const mockGameEvents: GameEvent[] = [
        {
          id: '1',
          publishedAt: '',
          title: 'Harvest Stawberries',
          description: 'Sell and plant more immediately.',
          tag: Tag.Fishing,
          gameDate: {
            isRecurring: false,
            year: 5,
            day: 1,
            season: Season.SPRING,
            id: '5',
          },
          type: Type.User,
        },
        {
          id: '2',
          publishedAt: '',
          title: 'Get More Stone',
          description: 'Need to build fishing pond.',
          tag: Tag.Fishing,
          gameDate: {
            isRecurring: false,
            year: 2,
            day: 1,
            season: Season.SUMMER,
            id: '1',
          },
          type: Type.User,
        },
        {
          id: '3',
          title: 'Egg Festival',
          description:
            'Like other festivals, the event lasts for most of the day and consists of two parts: a social portion and an Egg Hunt activity to finish the day. To take part, enter Pelican Town Square between 9am and 2pm. (It is impossible to enter the town before 9am; attempting to enter will say that the event is still being set up.) The festival will end immediately after the Egg Hunt or if the player leaves the Town, returning them to The Farm at 10pm.',
          tag: Tag.Festival,
          publishedAt: '',
          gameDate: {
            id: '1',
            isRecurring: true,
            day: 13,
            season: Season.SPRING,
          },
          type: Type.SystemFestivals,
        },
      ];

      const result = CalendarUtils.getFilteredSystemEvents(
        false,
        false,
        false,
        mockGameEvents,
      );
      expect(result).toEqual([mockGameEvents[0], mockGameEvents[1]]);
    });
  });

  describe('getLoadedCalendarName', () => {
    it('should return a new name with a [1] added at the end of the loaded calendar if no duplicates', () => {
      const mockUploadedCalendarName = 'Unique Calendar Name';
      const mockAvailableCalendars: Calendar[] = [
        { ...MOCK_CALENDARS[0], name: 'Speed Running' },
        { ...MOCK_CALENDARS[1], name: 'Casual Playthrough' },
      ];

      const result = CalendarUtils.getLoadedCalendarName(
        mockUploadedCalendarName,
        mockAvailableCalendars,
      );
      expect(result).toBe(`${mockUploadedCalendarName}`);
    });

    it('should increment the loaded calendar [x] number indicator according to if there are other same name calendars that also have the loaded [x] indicator', () => {
      const mockUploadedCalendarName = 'Duplicate Calendar Name';
      const mockAvailableCalendars: Calendar[] = [
        { ...MOCK_CALENDARS[0], name: 'Duplicate Calendar Name[1]' },
        { ...MOCK_CALENDARS[1], name: 'Duplicate Calendar Name[2]' },
        { ...MOCK_CALENDARS[1], name: 'Duplicate Calendar Name[3]' },
      ];

      const result = CalendarUtils.getLoadedCalendarName(
        mockUploadedCalendarName,
        mockAvailableCalendars,
      );
      expect(result).toBe(`${mockUploadedCalendarName}[4]`);
    });
  });
});
