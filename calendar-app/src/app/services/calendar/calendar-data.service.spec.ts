import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { lastValueFrom, of } from 'rxjs';
import { MOCK_CALENDAR_RESPONSE } from '../../../../tests/utils/mocks/calendar-response.mock';
import { MOCK_CALENDARS_RESPONSE } from '../../../../tests/utils/mocks/calendars-response.mock';
import { MOCK_CALENDARS } from '../../../../tests/utils/mocks/calendars.mock';
import { Calendar } from '../../models/calendar.model';
import { CalendarUtils } from '../calendar.utils';
import { DataService } from '../data.service';
import { CalendarDataService } from './calendar-data.service';

describe('CalendarDataService', () => {
  let spectator: SpectatorService<CalendarDataService>;
  let mockDataService: SpyObject<DataService>;

  const createService = createServiceFactory({
    service: CalendarDataService,
    mocks: [DataService],
  });

  beforeEach(() => {
    spectator = createService();
    mockDataService = spectator.inject(DataService);
  });

  describe('create', () => {
    it('should call the data service', async () => {
      const mockName = 'Test Calendar';
      const mockDescription = 'Test Description';
      const mockIncludeBirthdays = true;
      const mockIncludeFestivals = false;
      const mockIncludeCrops = true;

      mockDataService.graphql.mockReturnValue(
        of({ createCalendar: { data: MOCK_CALENDAR_RESPONSE } }),
      );

      await lastValueFrom(
        spectator.service.create(
          mockName,
          mockDescription,
          mockIncludeBirthdays,
          mockIncludeFestivals,
          mockIncludeCrops,
        ),
      );

      expect(mockDataService.graphql).toHaveBeenCalledWith(
        spectator.service.createQuery(),
        {
          name: mockName,
          description: mockDescription,
          publishedAt: expect.any(String),
          systemConfig: {
            includeBirthdays: mockIncludeBirthdays,
            includeFestivals: mockIncludeFestivals,
            includeCrops: mockIncludeCrops,
          },
        },
      );
    });

    it('should return data from the data service in the form of a calendar object', async () => {
      const name = 'Test Calendar';
      const description = 'Test Description';
      const includeBirthdays = true;
      const includeFestivals = false;
      const includeCrops = true;
      mockDataService.graphql.mockReturnValue(
        of({ createCalendar: { data: MOCK_CALENDAR_RESPONSE } }),
      );

      const result = await lastValueFrom(
        spectator.service.create(
          name,
          description,
          includeBirthdays,
          includeFestivals,
          includeCrops,
        ),
      );

      expect(result).toEqual(
        expect.objectContaining({
          name,
          description,
          systemConfig: { includeBirthdays, includeFestivals, includeCrops },
        }),
      );
    });
  });

  describe('get', () => {
    it('should call the data service and return a calendar object with the correct id', async () => {
      const mockId = '1';
      mockDataService.graphql.mockReturnValue(
        of({ calendar: { data: { ...MOCK_CALENDAR_RESPONSE, id: '1' } } }),
      );

      const result = await lastValueFrom(spectator.service.get(mockId));

      expect(mockDataService.graphql).toHaveBeenCalledWith(
        spectator.service.getOneQuery(),
        { id: mockId },
      );
      expect(result).toEqual(expect.objectContaining({ id: mockId }));
    });
  });

  describe('getAll', () => {
    it('should call the data service and return an array of calendar objects', async () => {
      mockDataService.graphql.mockReturnValue(of(MOCK_CALENDARS_RESPONSE));
      const expectedReturn: Calendar[] =
        MOCK_CALENDARS_RESPONSE.calendars.data.map((c) =>
          spectator.service.convertToCalendar(c),
        );

      const result = await lastValueFrom(spectator.service.getAll());

      expect(mockDataService.graphql).toHaveBeenCalledWith(
        spectator.service.getQuery(
          'getAllCalendars',
          `(pagination: { limit: -1 })`,
        ),
      );
      expect(
        result.length === MOCK_CALENDARS_RESPONSE.calendars.data.length,
      ).toBeTruthy();
      expect(result).toEqual(expectedReturn);
    });
  });

  describe('updateDetails', () => {
    it('should call the data service with the correct variables', async () => {
      const mockCalendar: Partial<Calendar> = {
        id: '1',
        name: 'Test Calendar',
        description: 'Test Description',
        systemConfig: {
          includeBirthdays: true,
          includeFestivals: false,
          includeCrops: true,
        },
      };
      mockDataService.graphql.mockReturnValue(
        of({ updateCalendar: { data: MOCK_CALENDAR_RESPONSE } }),
      );

      await lastValueFrom(spectator.service.updateDetails(mockCalendar));

      expect(mockDataService.graphql).toHaveBeenCalledWith(
        spectator.service.updateDetailsQuery(),
        {
          id: mockCalendar.id,
          name: mockCalendar.name,
          description: mockCalendar.description,
          systemConfig: mockCalendar.systemConfig,
        },
      );
    });

    it('should return a calendar object with the updated details', async () => {
      const mockCalendar: Partial<Calendar> = {
        id: '1',
        name: 'Test Calendar',
        description: 'Test Description',
        systemConfig: {
          includeBirthdays: true,
          includeFestivals: false,
          includeCrops: true,
        },
      };
      mockDataService.graphql.mockReturnValue(
        of({ updateCalendar: { data: MOCK_CALENDAR_RESPONSE } }),
      );

      const result = await lastValueFrom(
        spectator.service.updateDetails(mockCalendar),
      );

      expect(result).toEqual(expect.objectContaining(mockCalendar));
    });
  });

  describe('updateEvents', () => {
    it('should call the data service with the correct variables', async () => {
      const mockCalendar: Calendar = MOCK_CALENDARS[0];
      mockDataService.graphql.mockReturnValue(
        of({ updateCalendar: { data: MOCK_CALENDAR_RESPONSE } }),
      );

      await lastValueFrom(spectator.service.updateEvents(mockCalendar));

      expect(mockDataService.graphql).toHaveBeenCalledWith(
        spectator.service.updateEventsQuery(),
        {
          id: mockCalendar.id,
          gameEvents: mockCalendar.gameEvents.map((event) => event.id),
        },
      );
    });
  });

  describe('delete', () => {
    it('should call the data service with the correct id', async () => {
      const mockId = '1';
      mockDataService.graphql.mockReturnValue(
        of({ deleteCalendar: { data: { id: mockId } } }),
      );

      await lastValueFrom(spectator.service.delete(mockId));

      expect(mockDataService.graphql).toHaveBeenCalledWith(
        spectator.service.deleteQuery(),
        { id: mockId },
      );
    });

    it('should return the id of the deleted calendar', async () => {
      const mockId = '1';
      mockDataService.graphql.mockReturnValue(
        of({ deleteCalendar: { data: { id: mockId } } }),
      );

      const result = await lastValueFrom(spectator.service.delete(mockId));

      expect(result).toEqual(mockId);
    });
  });

  describe('convertToCalendar', () => {
    it('should convert a Calendar_Data object to a Calendar object', () => {
      const mockCalendarData = MOCK_CALENDAR_RESPONSE;
      const expectedReturn: Calendar = {
        id: MOCK_CALENDAR_RESPONSE.id,
        name: MOCK_CALENDAR_RESPONSE.attributes.name,
        description: MOCK_CALENDAR_RESPONSE.attributes.description,
        systemConfig: MOCK_CALENDAR_RESPONSE.attributes.systemConfig,
        gameEvents: MOCK_CALENDAR_RESPONSE.attributes.gameEvents.data.map(
          (e) => ({
            id: e.id,
            gameDate: CalendarUtils.getGameDateUnion(e.attributes.gameDate),
            publishedAt: '',
            description: e.attributes.description,
            tag: e.attributes.tag,
            title: e.attributes.title,
            type: e.attributes.type,
          }),
        ),
        publishedAt: '',
        filteredGameEvents: CalendarUtils.getFilteredSystemEvents(
          mockCalendarData.attributes.systemConfig.includeBirthdays,
          mockCalendarData.attributes.systemConfig.includeCrops,
          mockCalendarData.attributes.systemConfig.includeFestivals,
          mockCalendarData.attributes.gameEvents.data.map((e) => ({
            id: e.id,
            gameDate: CalendarUtils.getGameDateUnion(e.attributes.gameDate),
            publishedAt: '',
            description: e.attributes.description,
            tag: e.attributes.tag,
            title: e.attributes.title,
            type: e.attributes.type,
          })),
        ),
      };

      const result = spectator.service.convertToCalendar(mockCalendarData);

      expect(result).toEqual(expect.objectContaining(expectedReturn));
    });
  });
});
