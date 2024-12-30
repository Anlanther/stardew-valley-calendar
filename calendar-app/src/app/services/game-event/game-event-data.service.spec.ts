import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { lastValueFrom, of } from 'rxjs';
import { MOCK_BIRTHDAY_EVENTS } from '../../../../tests/utils/mocks/birthday-events.mock';
import { MOCK_GAME_EVENTS } from '../../../../tests/utils/mocks/game-events.mock';
import { MOCK_SYSTEM_EVENTS_RESPONSE } from '../../../../tests/utils/mocks/system-events-response.mock';
import { BIRTHDAY_EVENTS } from '../../constants/birthday-events.constant';
import { CROPS_DEADLINES } from '../../constants/crops-deadline.constant';
import { FESTIVAL_EVENTS } from '../../constants/festival-events.constant';
import { GameEvent, UnsavedGameEvent } from '../../models/game-event.model';
import { CalendarUtils } from '../calendar.utils';
import { DataService } from '../data.service';
import { GameEvent_Data, Type } from '../models/game-event';
import { GameDateComponent } from '../models/GameDateComponent';
import { GameEventDataService } from './game-event-data.service';

describe('GameEventDataService', () => {
  let spectator: SpectatorService<GameEventDataService>;
  let mockDataService: SpyObject<DataService>;

  const createService = createServiceFactory({
    service: GameEventDataService,
    mocks: [DataService],
  });

  beforeEach(() => {
    spectator = createService();
    mockDataService = spectator.inject(DataService);
  });

  describe('getOrCreateDefaults', () => {
    it('should return system events if they exist', async () => {
      const mockSavedSystemEvents = MOCK_SYSTEM_EVENTS_RESPONSE;
      mockDataService.graphql.mockReturnValue(of(mockSavedSystemEvents));
      const expectedTransformedReturn: GameEvent[] =
        mockSavedSystemEvents.gameEvents.data.map((e) => {
          const eventGameDate: GameDateComponent = {
            day: e.attributes!.gameDate!.day!,
            id: e.attributes!.gameDate!.id!,
            isRecurring: e.attributes!.gameDate!.isRecurring!,
            season: e.attributes!.gameDate!.season!,
            year: e.attributes!.gameDate!.year!,
          };
          return {
            id: e.id!,
            description: e.attributes!.description!,
            gameDate: CalendarUtils.getGameDateUnion(eventGameDate),
            publishedAt: '',
            tag: e.attributes!.tag!,
            title: e.attributes!.title!,
            type: e.attributes!.type!,
          };
        });

      const result = await lastValueFrom(
        spectator.service.getOrCreateDefaults(),
      );

      expect(result).toEqual(expectedTransformedReturn);
    });

    it('should create and return default events if system events are empty', async () => {
      const mockSystemEventsToBeCreated = [
        ...BIRTHDAY_EVENTS,
        ...FESTIVAL_EVENTS,
        ...CROPS_DEADLINES,
      ];
      mockDataService.graphql.mockReturnValue(
        of({ gameEvents: { data: [] as GameEvent[] } }),
      );
      spectator.service.create = jest.fn((gameEvent) =>
        of({
          ...gameEvent,
          id: '1',
          publishedAt: '',
          gameDate: CalendarUtils.getGameDateUnion({
            ...gameEvent.gameDate,
            id: '1',
          }),
        }),
      );

      const result = await lastValueFrom(
        spectator.service.getOrCreateDefaults(),
      );

      expect(
        result.every((r) =>
          mockSystemEventsToBeCreated.map((e) => e.title).includes(r.title),
        ),
      ).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should create a game event and return it', async () => {
      const mockGameEventCreated: UnsavedGameEvent = MOCK_GAME_EVENTS[0];
      const mockResponse = {
        createGameEvent: {
          data: {
            id: '1',
            attributes: { ...mockGameEventCreated },
          },
        },
      };
      mockDataService.graphql.mockReturnValue(of(mockResponse));

      const result = await lastValueFrom(
        spectator.service.create(mockGameEventCreated),
      );

      expect(result).toEqual({ id: '1', ...mockGameEventCreated });
      expect(mockDataService.graphql).toHaveBeenCalledWith(
        spectator.service.createQuery(),
        {
          ...mockGameEventCreated,
          publishedAt: expect.any(String),
          type: Type.User,
        },
      );
    });
  });

  describe('createMultiple', () => {
    it('should return an empty array if no events are provided', async () => {
      const mockNoEvents: UnsavedGameEvent[] = [];

      const result = await lastValueFrom(
        spectator.service.createMultiple(mockNoEvents),
      );

      expect(result).toEqual(mockNoEvents);
    });

    it('should create multiple game events and return them', async () => {
      const mockEventsToBeCreated: UnsavedGameEvent[] = MOCK_GAME_EVENTS;
      spectator.service.create = jest.fn((gameEvent) =>
        of({
          ...gameEvent,
          id: '1',
          publishedAt: '',
          gameDate: CalendarUtils.getGameDateUnion({
            ...gameEvent.gameDate,
            id: '1',
          }),
        }),
      );

      const result = await lastValueFrom(
        spectator.service.createMultiple(mockEventsToBeCreated),
      );

      expect(result.length === mockEventsToBeCreated.length).toBeTruthy();
      expect(
        result.every((r) =>
          mockEventsToBeCreated.map((e) => e.title).includes(r.title),
        ),
      );
      expect(spectator.service.create).toHaveBeenCalledTimes(
        mockEventsToBeCreated.length,
      );
    });
  });

  describe('update', () => {
    it('should update a game event and return the updated event', async () => {
      const mockUpdatedEvent: GameEvent = {
        ...MOCK_GAME_EVENTS[0],
        title: 'Updated Title',
      };
      const mockResponse = {
        updateGameEvent: {
          data: {
            id: '1',
            attributes: mockUpdatedEvent,
          },
        },
      };
      mockDataService.graphql.mockReturnValue(of(mockResponse));

      const response = await lastValueFrom(
        spectator.service.update(mockUpdatedEvent),
      );

      expect(response.title).toEqual(mockUpdatedEvent.title);
      expect(mockDataService.graphql).toHaveBeenCalledWith(
        spectator.service.updateQuery(),
        {
          id: mockUpdatedEvent.id,
          gameEvent: {
            title: mockUpdatedEvent.title,
            description: mockUpdatedEvent.description,
            tag: mockUpdatedEvent.tag,
            gameDate: mockUpdatedEvent.gameDate,
            type: mockUpdatedEvent.type,
          },
        },
      );
    });
  });

  describe('deleteMany', () => {
    it('should return an empty array if no IDs are provided', async () => {
      const result = await lastValueFrom(spectator.service.deleteMany([]));

      expect(result).toEqual([]);
    });

    it('should delete multiple game events and return their IDs', async () => {
      const mockGameEventIds = ['1', '2'];
      spectator.service.delete = jest.fn((id) => of(id));

      const result = await lastValueFrom(
        spectator.service.deleteMany(mockGameEventIds),
      );

      expect(result).toEqual(mockGameEventIds);
      expect(spectator.service.delete).toHaveBeenCalledTimes(
        mockGameEventIds.length,
      );
    });
  });

  describe('delete', () => {
    it('should delete a game event and return its ID', async () => {
      const mockGameEventId = '1';
      const mockResponse = {
        deleteGameEvent: {
          data: { id: mockGameEventId },
        },
      };
      mockDataService.graphql.mockReturnValueOnce(of(mockResponse));

      const result = await lastValueFrom(
        spectator.service.delete(mockGameEventId),
      );

      expect(result).toBe(mockGameEventId);

      expect(mockDataService.graphql).toHaveBeenCalledWith(
        spectator.service.deleteQuery(),
        { id: mockGameEventId },
      );
    });
  });

  describe('getSystem', () => {
    it('should retrieve system events', async () => {
      mockDataService.graphql.mockReturnValueOnce(
        of(MOCK_SYSTEM_EVENTS_RESPONSE),
      );
      const result = await lastValueFrom(spectator.service.getSystem());

      expect(
        result.every((r) =>
          MOCK_SYSTEM_EVENTS_RESPONSE.gameEvents.data
            .map((d) => d.attributes?.title)
            .includes(r.title),
        ),
      ).toBeTruthy();
    });
  });

  describe('convertToGameEvent', () => {
    it('should convert a GameEvent_Data object to a GameEvent object', () => {
      const mockGameEventData = MOCK_SYSTEM_EVENTS_RESPONSE.gameEvents
        .data[0] as GameEvent_Data;
      const expectedGameEvent: GameEvent = {
        id: mockGameEventData.id!,
        title: mockGameEventData.attributes!.title!,
        description: mockGameEventData.attributes!.description!,
        tag: mockGameEventData.attributes!.tag!,
        gameDate: CalendarUtils.getGameDateUnion({
          day: mockGameEventData.attributes!.gameDate!.day!,
          id: mockGameEventData.attributes!.gameDate!.id!,
          isRecurring: mockGameEventData.attributes!.gameDate!.isRecurring!,
          season: mockGameEventData.attributes!.gameDate!.season!,
          year: mockGameEventData.attributes!.gameDate!.year!,
        }),
        publishedAt: '',
        type: mockGameEventData.attributes!.type!,
      };

      const result = spectator.service.convertToGameEvent(mockGameEventData);

      expect(result).toEqual(expectedGameEvent);
    });
  });

  describe('updateSystem', () => {
    it('should call getSystem and deleteSystemEvents and createSystemEvents with all the already stored system events', async () => {
      const mockSystemEvents: GameEvent[] = MOCK_BIRTHDAY_EVENTS.map((e) => ({
        ...e,
        id: '1',
        publishedAt: '',
        gameDate: CalendarUtils.getGameDateUnion({
          ...e.gameDate,
          id: '1',
        }),
      }));
      spectator.service.getSystem = jest.fn(() => of(mockSystemEvents));
      spectator.service.updateMany = jest.fn(() => of([]));
      spectator.service.deleteSystemEvents = jest.fn(() => of([]));
      spectator.service.createSystemEvents = jest.fn(() =>
        of(mockSystemEvents),
      );

      await lastValueFrom(spectator.service.updateSystem());

      expect(spectator.service.getSystem).toHaveBeenCalled();
      expect(spectator.service.deleteSystemEvents).toHaveBeenCalledWith(
        mockSystemEvents,
      );
      expect(spectator.service.createSystemEvents).toHaveBeenCalledWith(
        mockSystemEvents,
      );
    });

    it('should call updateMany with events that already exist in storage updated based on the constants files', async () => {
      const mockSystemEvents: GameEvent[] = BIRTHDAY_EVENTS.map((e) => ({
        ...e,
        id: '1',
        publishedAt: '',
        gameDate: CalendarUtils.getGameDateUnion({
          ...e.gameDate,
          id: '1',
        }),
      }));
      spectator.service.getSystem = jest.fn(() => of(mockSystemEvents));
      spectator.service.updateMany = jest.fn(() => of([]));
      spectator.service.deleteSystemEvents = jest.fn(() => of([]));
      spectator.service.createSystemEvents = jest.fn(() => of([]));

      await lastValueFrom(spectator.service.updateSystem());

      expect(spectator.service.updateMany).toHaveBeenCalledWith(
        mockSystemEvents,
      );
    });

    it('should not pass events that do not exist in storage to updateMany', async () => {
      const mockSystemEvents: GameEvent[] = BIRTHDAY_EVENTS.map((e) => ({
        ...e,
        id: '1',
        publishedAt: '',
        gameDate: CalendarUtils.getGameDateUnion({
          ...e.gameDate,
          id: '1',
        }),
      }));
      const mockUnsavedEvent: GameEvent = MOCK_GAME_EVENTS[0];

      spectator.service.getSystem = jest.fn(() =>
        of([mockUnsavedEvent, ...mockSystemEvents]),
      );
      spectator.service.updateMany = jest.fn(() => of([]));
      spectator.service.deleteSystemEvents = jest.fn(() => of([]));
      spectator.service.createSystemEvents = jest.fn(() => of([]));

      await lastValueFrom(spectator.service.updateSystem());

      expect(spectator.service.updateMany).toHaveBeenCalledWith(
        mockSystemEvents,
      );
    });
  });

  describe('updateMany', () => {
    it('should call update for each game event and return the updated events', async () => {
      const mockUpdatedEvents: GameEvent[] = MOCK_GAME_EVENTS.map((e, i) => ({
        ...e,
        id: '1',
        title: `Updated Title ${i + 1}`,
        publishedAt: '',
        gameDate: CalendarUtils.getGameDateUnion({
          ...e.gameDate,
          id: '1',
        }),
      }));
      spectator.service.update = jest.fn((event) => of(event));

      const result = await lastValueFrom(
        spectator.service.updateMany(mockUpdatedEvents),
      );

      expect(result).toEqual(mockUpdatedEvents);
      expect(spectator.service.update).toHaveBeenCalledTimes(
        mockUpdatedEvents.length,
      );
    });
  });

  describe('deleteSystemEvents', () => {
    it('should delete system events that are not in the default events constant file', async () => {
      const mockEventNotInConstants: GameEvent = {
        ...MOCK_GAME_EVENTS[0],
        id: '1',
        publishedAt: '',
        title: 'Not in Constants',
        gameDate: CalendarUtils.getGameDateUnion({
          ...MOCK_GAME_EVENTS[0].gameDate,
          id: '1',
        }),
      };
      spectator.service.delete = jest.fn(() => of(mockEventNotInConstants.id));

      const result = await lastValueFrom(
        spectator.service.deleteSystemEvents([mockEventNotInConstants]),
      );

      expect(result).toEqual([mockEventNotInConstants.id]);
    });

    it('should return an empty array if all events passed exists in the constants file', async () => {
      const mockEventInConstants: GameEvent = {
        ...MOCK_BIRTHDAY_EVENTS[0],
        id: '1',
        publishedAt: '',
        gameDate: CalendarUtils.getGameDateUnion({
          ...MOCK_BIRTHDAY_EVENTS[0].gameDate,
          id: '1',
        }),
      };

      const result = await lastValueFrom(
        spectator.service.deleteSystemEvents([mockEventInConstants]),
      );

      expect(result).toEqual([]);
    });
  });

  describe('createSystemEvents', () => {
    it('should create system events that were newly added into system constants file that are not yet saved in the db', async () => {
      const mockSavedSystemEventsMissingCrops = [
        ...BIRTHDAY_EVENTS.map((e) => ({
          ...e,
          id: '1',
          gameDate: CalendarUtils.getGameDateUnion({ ...e.gameDate, id: '1' }),
          publishedAt: '',
        })),
        ...FESTIVAL_EVENTS.map((e) => ({
          ...e,
          id: '1',
          gameDate: CalendarUtils.getGameDateUnion({ ...e.gameDate, id: '1' }),
          publishedAt: '',
        })),
      ];
      spectator.service.create = jest.fn((e) =>
        of({
          ...e,
          id: '1',
          publishedAt: '',
          gameDate: CalendarUtils.getGameDateUnion({ ...e.gameDate, id: '1' }),
        }),
      );

      const result = await lastValueFrom(
        spectator.service.createSystemEvents(mockSavedSystemEventsMissingCrops),
      );

      expect(result).toEqual(
        [...CROPS_DEADLINES].map((e) => ({
          ...e,
          id: '1',
          publishedAt: '',
          gameDate: CalendarUtils.getGameDateUnion({ ...e.gameDate, id: '1' }),
        })),
      );
      expect(spectator.service.create).toHaveBeenCalledTimes(
        CROPS_DEADLINES.length,
      );
    });

    it('should return an empty array if all system events in constants file is already saved in the db', async () => {
      const allSystemEventsSaved: GameEvent[] = [
        ...BIRTHDAY_EVENTS.map((e) => ({
          ...e,
          id: '1',
          gameDate: CalendarUtils.getGameDateUnion({ ...e.gameDate, id: '1' }),
          publishedAt: '',
        })),
        ...FESTIVAL_EVENTS.map((e) => ({
          ...e,
          id: '1',
          gameDate: CalendarUtils.getGameDateUnion({ ...e.gameDate, id: '1' }),
          publishedAt: '',
        })),
        ...CROPS_DEADLINES.map((e) => ({
          ...e,
          id: '1',
          gameDate: CalendarUtils.getGameDateUnion({ ...e.gameDate, id: '1' }),
          publishedAt: '',
        })),
      ];

      const result = await lastValueFrom(
        spectator.service.createSystemEvents(allSystemEventsSaved),
      );
      spectator.service.create = jest.fn();

      expect(result).toEqual([]);
      expect(spectator.service.create).toHaveBeenCalledTimes(0);
    });
  });
});
