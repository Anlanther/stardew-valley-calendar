import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  SpectatorService,
  SpyObject,
  createServiceFactory,
} from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { MOCK_CALENDARS } from '../../../tests/utils/mocks/calendars.mock';
import { MOCK_GAME_EVENTS } from '../../../tests/utils/mocks/game-events.mock';
import { CreateCalendarDialogComponent } from '../components/dialogs/calendar/create-dialog/create-dialog.component';
import { EditCalendarDialogComponent } from '../components/dialogs/calendar/edit-dialog/edit-dialog.component';
import { SelectCalendarDialogComponent } from '../components/dialogs/calendar/select-dialog/select-dialog.component';
import { DeleteDialogComponent } from '../components/dialogs/delete/delete-dialog.component';
import { CreateEventDialogComponent } from '../components/dialogs/game-event/create-dialog/create-dialog.component';
import { EditEventDialogComponent } from '../components/dialogs/game-event/edit-dialog/edit-dialog.component';
import { TokenDialogComponent } from '../components/dialogs/token/token-dialog.component';
import { AppStore } from '../models/app-store.model';
import { Calendar } from '../models/calendar.model';
import { DownloadedCalendar } from '../models/downloaded-calendar.model';
import { GameEvent, UnsavedGameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { SelectedDate } from '../models/selected-date.model';
import { Tag } from '../models/tag.model';
import { Type } from '../models/type.model';
import { CalendarDataService } from '../services/calendar/calendar-data.service';
import { DataService } from '../services/data.service';
import { GameEventDataService } from '../services/game-event/game-event-data.service';
import { OfflineDataService } from '../services/offline-data.service';
import { AppActions } from './app.actions';
import { AppEffects } from './app.effect';
import { AppFeature } from './app.state';

describe('AppEffects', () => {
  let spectator: SpectatorService<AppEffects>;
  let mockActions$ = new Observable<Action>();
  let mockCalendarDataService: SpyObject<CalendarDataService>;
  let mockGameEventDataService: SpyObject<GameEventDataService>;
  let mockDataService: SpyObject<DataService>;
  let mockOfflineDataService: SpyObject<OfflineDataService>;
  let mockStore: MockStore<AppStore>;
  let mockDialog: SpyObject<MatDialog>;

  function setMockDialogToReturn<T>(value: T) {
    const dialogServiceMock = spectator.inject(MatDialog);
    dialogServiceMock.open.mockReturnValue({
      afterClosed: () => of(value),
    } as MatDialogRef<T>);
  }

  const createService = createServiceFactory({
    service: AppEffects,
    providers: [
      provideMockActions(() => mockActions$),
      provideMockStore({
        selectors: [],
      }),
    ],
    mocks: [
      MatDialog,
      CalendarDataService,
      GameEventDataService,
      DataService,
      OfflineDataService,
    ],
  });

  beforeEach(() => {
    spectator = createService();
    mockCalendarDataService = spectator.inject(CalendarDataService);
    mockGameEventDataService = spectator.inject(GameEventDataService);
    mockDataService = spectator.inject(DataService);
    mockOfflineDataService = spectator.inject(OfflineDataService);
    mockStore = spectator.inject(MockStore);
    mockDialog = spectator.inject(MatDialog);
  });

  describe('initialise$', () => {
    it('should trigger get calendar and create default events action when the app calls to initialise', () => {
      mockActions$ = hot('-a', { a: AppActions.initialise() });
      const expected = cold('-(ab)', {
        a: AppActions.getCalendars(),
        b: AppActions.createDefaultGameEvents(),
      });

      expect(spectator.service.initialise$).toBeObservable(expected);
    });
    it('should trigger get calendar and create default events action when the app calls to initialise and is set to offline mode', () => {
      mockActions$ = hot('-a', { a: AppActions.setOfflineMode() });
      const expected = cold('-(ab)', {
        a: AppActions.getCalendars(),
        b: AppActions.createDefaultGameEvents(),
      });

      expect(spectator.service.initialise$).toBeObservable(expected);
    });
  });

  describe('getAllCalendars$', () => {
    const mockCalendarsResponseFromApi: Calendar[] = MOCK_CALENDARS;
    const mockError = { message: 'Error' };

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);

      mockCalendarDataService.getAll.mockReturnValue(
        of(mockCalendarsResponseFromApi),
      );
      mockOfflineDataService.getAllCalendars.mockReturnValue(
        of(mockCalendarsResponseFromApi),
      );
    });
    it('should call on getCalendarsSuccess with a list of calendars obtained from calendar data service', () => {
      const expected = cold('-a', {
        a: AppActions.getCalendarsSuccess(mockCalendarsResponseFromApi),
      });

      expect(spectator.service.getAllCalendars$).toBeObservable(expected);
      spectator.service.getAllCalendars$.subscribe(() => {
        expect(mockCalendarDataService.getAll).toHaveBeenCalled();
      });

      mockActions$ = hot('-a', { a: AppActions.getCalendars() });
    });
    it('should call on getCalendarsSuccess with a list of calendars obtained from offline data service when the app is on offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.getCalendarsSuccess(mockCalendarsResponseFromApi),
      });

      expect(spectator.service.getAllCalendars$).toBeObservable(expected);
      spectator.service.getAllCalendars$.subscribe(() => {
        expect(mockOfflineDataService.getAllCalendars).toHaveBeenCalled();
      });

      mockActions$ = hot('-a', { a: AppActions.getCalendars() });
    });
    it('should trigger aPIFailed action when calendar data service fails to get a list of calendars', () => {
      mockCalendarDataService.getAll.mockReturnValue(
        throwError(() => mockError),
      );
      mockActions$ = hot('-a', { a: AppActions.getCalendars() });
      const expected = cold('-(a|)', {
        a: AppActions.aPIFailed(),
      });

      expect(spectator.service.getAllCalendars$).toBeObservable(expected);
    });
  });

  describe('createCalendar$', () => {
    const mockCalendarResponseFromApi: Calendar = MOCK_CALENDARS[0];
    const mockExistingCalendars: Calendar[] = [MOCK_CALENDARS[1]];
    const mockDialogReturnValue = {
      name: MOCK_CALENDARS[0].name,
      description: MOCK_CALENDARS[0].description,
      includeFestivals: MOCK_CALENDARS[0].systemConfig.includeFestivals,
      includeCrops: MOCK_CALENDARS[0].systemConfig.includeCrops,
      includeBirthdays: MOCK_CALENDARS[0].systemConfig.includeBirthdays,
    };

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(
        AppFeature.selectAvailableCalendars,
        mockExistingCalendars,
      );

      mockCalendarDataService.create.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
      mockOfflineDataService.createCalendar.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );

      setMockDialogToReturn<{
        name: string;
        includeBirthdays: boolean;
        includeFestivals: boolean;
        includeCrops: boolean;
        description: string;
      }>(mockDialogReturnValue);
    });

    it('should open the CreateCalendarDialogComponent with a min height of 360px and with a list of existing calendar names', () => {
      mockActions$ = hot('-a', { a: AppActions.createCalendar() });

      spectator.service.createCalendar$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(
          CreateCalendarDialogComponent,
          {
            data: {
              existingCalendars: mockExistingCalendars.map((c) => c.name),
            },
            minHeight: 360,
          },
        );
      });
    });
    it('should trigger the createCalendarSuccess action with the response obtained by the API based on the dialog input', () => {
      mockCalendarDataService.create.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
      const expected = cold('-a', {
        a: AppActions.createCalendarSuccess(mockCalendarResponseFromApi),
      });

      mockActions$ = hot('-a', { a: AppActions.createCalendar() });

      expect(spectator.service.createCalendar$).toBeObservable(expected);
      spectator.service.createCalendar$.subscribe(() => {
        expect(mockCalendarDataService.create).toHaveBeenCalledWith(
          mockDialogReturnValue.name,
          mockDialogReturnValue.description,
          mockDialogReturnValue.includeBirthdays,
          mockDialogReturnValue.includeFestivals,
          mockDialogReturnValue.includeCrops,
        );
      });
    });
    it('should trigger the createCalendarSuccess action with the response obtained by the offlineDataService based on the dialog input when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.createCalendarSuccess(mockCalendarResponseFromApi),
      });

      mockActions$ = hot('-a', { a: AppActions.createCalendar() });

      expect(spectator.service.createCalendar$).toBeObservable(expected);
      spectator.service.getAllCalendars$.subscribe(() => {
        expect(mockOfflineDataService.createCalendar).toHaveBeenCalledWith(
          mockDialogReturnValue.name,
          mockDialogReturnValue.description,
          mockDialogReturnValue.includeBirthdays,
          mockDialogReturnValue.includeFestivals,
          mockDialogReturnValue.includeCrops,
        );
      });
    });
  });

  describe('setToken$', () => {
    it('should open the TokenDialogComponent and trigger initialise with the token obtained and set on the dataService for the rest of the session', () => {
      const mockToken = 'mockToken123';
      setMockDialogToReturn<{
        token: string;
      }>({ token: mockToken });
      const expected = cold('-a', {
        a: AppActions.initialise(),
      });

      mockActions$ = hot('-a', { a: AppActions.setToken() });

      expect(spectator.service.setToken$).toBeObservable(expected);
      spectator.service.setToken$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(TokenDialogComponent);
        expect(mockDataService.setToken).toHaveBeenCalledWith(mockToken);
      });
    });
  });

  describe('getOrCreateSystemEvents$', () => {
    const mockGameEventResponseFromApi: GameEvent[] = MOCK_GAME_EVENTS;

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);

      mockGameEventDataService.getOrCreateDefaults.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      mockOfflineDataService.getOrCreateEventDefaults.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
    });

    it('should trigger gameEventDataService to get or create default game events when createDefaultGameEvents is called', () => {
      mockGameEventDataService.getOrCreateDefaults.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      const expected = cold('-a', {
        a: AppActions.createDefaultGameEventsSuccess(
          mockGameEventResponseFromApi,
        ),
      });

      mockActions$ = hot('-a', { a: AppActions.createDefaultGameEvents() });

      expect(spectator.service.getOrCreateSystemEvents$).toBeObservable(
        expected,
      );
      spectator.service.getOrCreateSystemEvents$.subscribe(() => {
        expect(mockGameEventDataService.getOrCreateDefaults).toHaveBeenCalled();
      });
    });
    it('should trigger gameEventDataService to get or create default game events when updatedSystemEventsSuccess is called', () => {
      const expected = cold('-a', {
        a: AppActions.createDefaultGameEventsSuccess(
          mockGameEventResponseFromApi,
        ),
      });

      mockActions$ = hot('-a', { a: AppActions.updatedSystemEventsSuccess() });

      expect(spectator.service.getOrCreateSystemEvents$).toBeObservable(
        expected,
      );
      spectator.service.getOrCreateSystemEvents$.subscribe(() => {
        expect(mockGameEventDataService.getOrCreateDefaults).toHaveBeenCalled();
      });
    });
    it('should trigger offlineDataService to get or create default game events when updatedSystemEventsSuccess is called and app is set to offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.createDefaultGameEventsSuccess(
          mockGameEventResponseFromApi,
        ),
      });

      mockActions$ = hot('-a', { a: AppActions.updatedSystemEventsSuccess() });

      expect(spectator.service.getOrCreateSystemEvents$).toBeObservable(
        expected,
      );
      spectator.service.getOrCreateSystemEvents$.subscribe(() => {
        expect(
          mockOfflineDataService.getOrCreateEventDefaults,
        ).toHaveBeenCalled();
      });
    });

    it('should trigger offlineDataService API to get or create default game events when createDefaultGameEvents is called and app is set to offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.createDefaultGameEventsSuccess(
          mockGameEventResponseFromApi,
        ),
      });

      mockActions$ = hot('-a', { a: AppActions.createDefaultGameEvents() });

      expect(spectator.service.getOrCreateSystemEvents$).toBeObservable(
        expected,
      );
      spectator.service.getOrCreateSystemEvents$.subscribe(() => {
        expect(
          mockOfflineDataService.getOrCreateEventDefaults,
        ).toHaveBeenCalled();
      });
    });
  });

  describe('selectCalendar$', () => {
    const mocCalendarResponseFromApi: Calendar = MOCK_CALENDARS[0];
    const mockAvailableCalendars: Calendar[] = MOCK_CALENDARS;
    const mockDialogReturnValue = {
      id: MOCK_CALENDARS[0].id,
      availableCalendars: mockAvailableCalendars,
    };
    const mockActiveCalendar: Calendar = MOCK_CALENDARS[1];

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(
        AppFeature.selectAvailableCalendars,
        mockAvailableCalendars,
      );
      mockStore.overrideSelector(
        AppFeature.selectActiveCalendar,
        mockActiveCalendar,
      );

      mockCalendarDataService.get.mockReturnValue(
        of(mocCalendarResponseFromApi),
      );
      mockOfflineDataService.getCalendar.mockReturnValue(
        of(mocCalendarResponseFromApi),
      );

      setMockDialogToReturn<{ id: string }>(mockDialogReturnValue);
    });

    it('should trigger the SelectCalendarDialogComponent to open with a list of all the available calendars and the current active calendar', () => {
      mockActions$ = hot('-a', { a: AppActions.selectCalendar() });

      spectator.service.selectCalendar$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(
          SelectCalendarDialogComponent,
          {
            data: {
              availableCalendars: mockAvailableCalendars,
              activeCalendar: mockActiveCalendar,
            },
          },
        );
      });
    });
    it('should trigger the updateActiveCalendar action with the response obtained by the API based on the dialog input', () => {
      mockCalendarDataService.get.mockReturnValue(
        of(mocCalendarResponseFromApi),
      );
      const expected = cold('-a', {
        a: AppActions.updateActiveCalendar(mocCalendarResponseFromApi),
      });

      mockActions$ = hot('-a', { a: AppActions.selectCalendar() });

      expect(spectator.service.selectCalendar$).toBeObservable(expected);
      spectator.service.selectCalendar$.subscribe(() => {
        expect(mockCalendarDataService.get).toHaveBeenCalledWith(
          mockDialogReturnValue.id,
        );
      });
    });
    it('should trigger the updateActiveCalendar action with the response obtained by the offlineDataService based on the dialog input when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.updateActiveCalendar(mocCalendarResponseFromApi),
      });

      mockActions$ = hot('-a', { a: AppActions.selectCalendar() });

      expect(spectator.service.selectCalendar$).toBeObservable(expected);
      spectator.service.selectCalendar$.subscribe(() => {
        expect(mockOfflineDataService.getCalendar).toHaveBeenCalledWith(
          mockDialogReturnValue.id,
          mockDialogReturnValue.availableCalendars,
        );
      });
    });
  });

  describe('updateGameEvent$', () => {
    const mockGameEventToBeEdited: GameEvent = MOCK_GAME_EVENTS[0];
    const mockDialogReturnValue = {
      gameEvent: { ...mockGameEventToBeEdited, name: 'Edited Mock Game Event' },
    };
    const mockGameEventResponseFromApi: GameEvent =
      mockDialogReturnValue.gameEvent;
    const mockActiveDate: SelectedDate = {
      day: 1,
      season: Season.SPRING,
      year: 1,
    };
    const mockExistingEvents: GameEvent[] = MOCK_GAME_EVENTS;
    const mockActiveCalendar: Calendar = MOCK_CALENDARS[0];

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(AppFeature.selectSelectedDate, mockActiveDate);
      mockStore.overrideSelector(
        AppFeature.selectActiveDayEvents,
        MOCK_GAME_EVENTS,
      );
      mockStore.overrideSelector(
        AppFeature.selectActiveCalendar,
        mockActiveCalendar,
      );

      mockOfflineDataService.updateGameEvent.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      mockGameEventDataService.update.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      setMockDialogToReturn<{ gameEvent: GameEvent }>(mockDialogReturnValue);
    });

    it('should trigger the EditEventDialogComponent to open with the min height of 420 and event to be edited, active year, and array of existing events', () => {
      mockActions$ = hot('-a', {
        a: AppActions.updateEvent(mockGameEventToBeEdited),
      });

      spectator.service.updateGameEvent$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(EditEventDialogComponent, {
          data: {
            gameEvent: mockGameEventToBeEdited,
            activeYear: mockActiveDate.year,
            existingEvents: mockExistingEvents,
            object: 'event',
          },
          minHeight: 420,
        });
      });
    });

    it('should trigger the updateEventSuccess action with the response obtained by the API based on the dialog input', () => {
      mockGameEventDataService.update.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      const expected = cold('-a', {
        a: AppActions.updateEventSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', {
        a: AppActions.updateEvent(mockGameEventToBeEdited),
      });

      expect(spectator.service.updateGameEvent$).toBeObservable(expected);
      spectator.service.updateGameEvent$.subscribe(() => {
        expect(mockGameEventDataService.update).toHaveBeenCalledWith(
          mockDialogReturnValue.gameEvent,
        );
      });
    });

    it('should trigger the updateEventSuccess action with the response obtained by the offlineDataService based on the dialog input when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.updateEventSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', {
        a: AppActions.updateEvent(mockGameEventToBeEdited),
      });

      expect(spectator.service.updateGameEvent$).toBeObservable(expected);
      spectator.service.updateGameEvent$.subscribe(() => {
        expect(mockOfflineDataService.updateGameEvent).toHaveBeenCalledWith(
          mockDialogReturnValue.gameEvent,
          mockActiveCalendar,
        );
      });
    });
  });

  describe('updateGoal$', () => {
    const mockGoalToBeEdited: GameEvent = {
      ...MOCK_GAME_EVENTS[0],
      gameDate: { ...MOCK_GAME_EVENTS[0].gameDate, day: 0 },
    };
    const mockDialogReturnValue = {
      gameEvent: { ...mockGoalToBeEdited, name: 'Edited Mock Game Event' },
    };
    const mockGameEventResponseFromApi: GameEvent =
      mockDialogReturnValue.gameEvent;
    const mockActiveDate: SelectedDate = {
      day: 1,
      season: Season.SPRING,
      year: 1,
    };
    const mockExistingGoals: GameEvent[] = MOCK_GAME_EVENTS.map((e) => ({
      ...e,
      gameDate: { ...e.gameDate, day: 0 },
    }));
    const mockActiveCalendar: Calendar = MOCK_CALENDARS[0];

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(AppFeature.selectSelectedDate, mockActiveDate);
      mockStore.overrideSelector(
        AppFeature.selectActiveSeasonGoals,
        mockExistingGoals,
      );
      mockStore.overrideSelector(
        AppFeature.selectActiveCalendar,
        mockActiveCalendar,
      );

      mockOfflineDataService.updateGameEvent.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      mockGameEventDataService.update.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      setMockDialogToReturn<{ gameEvent: GameEvent }>(mockDialogReturnValue);
    });

    it('should trigger the EditEventDialogComponent to open with the min height of 420 and event to be edited, active year, and array of existing events', () => {
      mockActions$ = hot('-a', {
        a: AppActions.updateGoal(mockGoalToBeEdited),
      });

      spectator.service.updateGoal$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(EditEventDialogComponent, {
          data: {
            gameEvent: mockGoalToBeEdited,
            activeYear: mockActiveDate.year,
            existingEvents: mockExistingGoals,
            object: 'goal',
          },
          minHeight: 420,
        });
      });
    });

    it('should trigger the updateGoalSuccess action with the response obtained by the API based on the dialog input', () => {
      mockGameEventDataService.update.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      const expected = cold('-a', {
        a: AppActions.updateGoalSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', {
        a: AppActions.updateGoal(mockGoalToBeEdited),
      });

      expect(spectator.service.updateGoal$).toBeObservable(expected);
      spectator.service.updateGameEvent$.subscribe(() => {
        expect(mockGameEventDataService.update).toHaveBeenCalledWith(
          mockDialogReturnValue.gameEvent,
        );
      });
    });

    it('should trigger the updateGoalSuccess action with the response obtained by the offlineDataService based on the dialog input when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.updateGoalSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', {
        a: AppActions.updateGoal(mockGoalToBeEdited),
      });

      expect(spectator.service.updateGoal$).toBeObservable(expected);
      spectator.service.updateGameEvent$.subscribe(() => {
        expect(mockOfflineDataService.updateGameEvent).toHaveBeenCalledWith(
          mockDialogReturnValue.gameEvent,
          mockActiveCalendar,
        );
      });
    });
  });

  describe('deleteEvent$', () => {
    const mockEventToBeDeleted: GameEvent = MOCK_GAME_EVENTS[0];
    const mockGameEventResponseFromApi: string = mockEventToBeDeleted.id;
    const mockDialogReturnValue = {
      id: mockEventToBeDeleted.id,
    };

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);

      mockGameEventDataService.delete.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      mockOfflineDataService.deleteGameEvent.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      setMockDialogToReturn<{ id: string }>(mockDialogReturnValue);
    });

    it('should trigger the DeleteDialogComponent to open with event message and the ID and name of the event to be deleted', () => {
      mockActions$ = hot('-a', {
        a: AppActions.deleteEvent(
          mockEventToBeDeleted.id,
          mockEventToBeDeleted.title,
        ),
      });

      spectator.service.deleteEvent$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(DeleteDialogComponent, {
          data: {
            id: mockEventToBeDeleted.id,
            name: mockEventToBeDeleted.title,
            object: 'event',
          },
        });
      });
    });

    it('should trigger the deleteEventSuccess action with the response obtained by the API based on the dialog input', () => {
      const expected = cold('-a', {
        a: AppActions.deleteEventSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', {
        a: AppActions.deleteEvent(
          mockEventToBeDeleted.id,
          mockEventToBeDeleted.title,
        ),
      });

      expect(spectator.service.deleteEvent$).toBeObservable(expected);
      spectator.service.deleteEvent$.subscribe(() => {
        expect(mockGameEventDataService.delete).toHaveBeenCalledWith(
          mockDialogReturnValue.id,
        );
      });
    });

    it('should trigger the deleteEventSuccess action with the response obtained by the offlineDataService based on the dialog input when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.deleteEventSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', {
        a: AppActions.deleteEvent(
          mockEventToBeDeleted.id,
          mockEventToBeDeleted.title,
        ),
      });

      expect(spectator.service.deleteEvent$).toBeObservable(expected);
      spectator.service.deleteEvent$.subscribe(() => {
        expect(mockOfflineDataService.deleteGameEvent).toHaveBeenCalledWith(
          mockDialogReturnValue.id,
        );
      });
    });
  });

  describe('deleteGoal$', () => {
    const mockGoalToBeDeleted: GameEvent = {
      ...MOCK_GAME_EVENTS[0],
      gameDate: { ...MOCK_GAME_EVENTS[0].gameDate, day: 0 },
    };
    const mockGameEventResponseFromApi: string = mockGoalToBeDeleted.id;
    const mockDialogReturnValue = {
      id: mockGoalToBeDeleted.id,
    };

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);

      mockGameEventDataService.delete.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      mockOfflineDataService.deleteGameEvent.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      setMockDialogToReturn<{ id: string }>(mockDialogReturnValue);
    });

    it('should trigger the DeleteDialogComponent to open with event message and the ID and name of the event to be deleted', () => {
      mockActions$ = hot('-a', {
        a: AppActions.deleteGoal(
          mockGoalToBeDeleted.id,
          mockGoalToBeDeleted.title,
        ),
      });

      spectator.service.deleteGoal$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(DeleteDialogComponent, {
          data: {
            id: mockGoalToBeDeleted.id,
            name: mockGoalToBeDeleted.title,
            object: 'goal',
          },
        });
      });
    });

    it('should trigger the deleteGoalSuccess action with the response obtained by the API based on the dialog input', () => {
      const expected = cold('-a', {
        a: AppActions.deleteGoalSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', {
        a: AppActions.deleteGoal(
          mockGoalToBeDeleted.id,
          mockGoalToBeDeleted.title,
        ),
      });

      expect(spectator.service.deleteGoal$).toBeObservable(expected);
      spectator.service.deleteGoal$.subscribe(() => {
        expect(mockGameEventDataService.delete).toHaveBeenCalledWith(
          mockDialogReturnValue.id,
        );
      });
    });

    it('should trigger the deleteGoalSuccess action with the response obtained by the offlineDataService based on the dialog input when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.deleteGoalSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', {
        a: AppActions.deleteGoal(
          mockGoalToBeDeleted.id,
          mockGoalToBeDeleted.title,
        ),
      });

      expect(spectator.service.deleteGoal$).toBeObservable(expected);
      spectator.service.deleteGoal$.subscribe(() => {
        expect(mockOfflineDataService.deleteGameEvent).toHaveBeenCalledWith(
          mockDialogReturnValue.id,
        );
      });
    });
  });

  describe('deleteCalendarGameEvents$', () => {
    const mockCalendarToBeDeleted: Calendar = {
      ...MOCK_CALENDARS[0],
      gameEvents: MOCK_GAME_EVENTS,
    };
    const mockGameEventIdsResponseFromApi: string[] =
      mockCalendarToBeDeleted.gameEvents.map((e) => e.id);

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);

      mockGameEventDataService.deleteMany.mockReturnValue(
        of(mockGameEventIdsResponseFromApi),
      );
      mockOfflineDataService.deleteManyGameEvents.mockReturnValue(
        of(mockGameEventIdsResponseFromApi),
      );
    });

    it('should trigger the deleteCalendarSuccess action with the response obtained by the API', () => {
      const expected = cold('-a', {
        a: AppActions.deleteCalendarSuccess(mockCalendarToBeDeleted.id),
      });

      mockActions$ = hot('-a', {
        a: AppActions.deleteCalendarGameEvents(
          mockCalendarToBeDeleted.id,
          mockCalendarToBeDeleted.gameEvents.map((e) => e.id),
        ),
      });

      expect(spectator.service.deleteCalendarGameEvents$).toBeObservable(
        expected,
      );
      spectator.service.deleteCalendarGameEvents$.subscribe(() => {
        expect(mockGameEventDataService.deleteMany).toHaveBeenCalledWith(
          mockCalendarToBeDeleted.gameEvents.map((e) => e.id),
        );
      });
    });

    it('should trigger the deleteCalendarSuccess action with the response obtained by the offlineDataService when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.deleteCalendarSuccess(mockCalendarToBeDeleted.id),
      });

      mockActions$ = hot('-a', {
        a: AppActions.deleteCalendarGameEvents(
          mockCalendarToBeDeleted.id,
          mockCalendarToBeDeleted.gameEvents.map((e) => e.id),
        ),
      });

      expect(spectator.service.deleteCalendarGameEvents$).toBeObservable(
        expected,
      );
      spectator.service.deleteCalendarGameEvents$.subscribe(() => {
        expect(
          mockOfflineDataService.deleteManyGameEvents,
        ).toHaveBeenCalledWith(
          mockCalendarToBeDeleted.gameEvents.map((e) => e.id),
        );
      });
    });
  });

  describe('deleteCalendar$', () => {
    const mockCalendarToBeDeleted: Calendar = {
      ...MOCK_CALENDARS[0],
      gameEvents: MOCK_GAME_EVENTS,
    };
    const mockDialogReturnValue = {
      id: mockCalendarToBeDeleted.id,
      gameEvents: mockCalendarToBeDeleted.gameEvents,
    };
    const mockCalendarResponseFromApi: string = mockDialogReturnValue.id;
    const userCreatedGameEventIds: string[] = mockCalendarToBeDeleted.gameEvents
      .filter((e) => e.type === Type.User)
      .map((e) => e.id);

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(
        AppFeature.selectActiveCalendar,
        mockCalendarToBeDeleted,
      );

      mockCalendarDataService.delete.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
      mockOfflineDataService.deleteCalendar.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
      setMockDialogToReturn<{ id: string; gameEvents: GameEvent[] }>(
        mockDialogReturnValue,
      );
    });

    it('should trigger the DeleteDialogComponent to open with the calendar message and active calendar ID, name, and game events', () => {
      mockActions$ = hot('-a', { a: AppActions.deleteCalendar() });

      spectator.service.deleteCalendar$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(DeleteDialogComponent, {
          data: {
            id: mockCalendarToBeDeleted.id,
            name: mockCalendarToBeDeleted.name,
            object: 'calendar',
            gameEvents: mockCalendarToBeDeleted.gameEvents,
          },
        });
      });
    });

    it('should trigger the deleteCalendarGameEvents action with the response obtained by the API based on the dialog input to delete the active calendar and its user-created game events', () => {
      const expected = cold('-a', {
        a: AppActions.deleteCalendarGameEvents(
          mockCalendarToBeDeleted.id,
          userCreatedGameEventIds,
        ),
      });

      mockActions$ = hot('-a', { a: AppActions.deleteCalendar() });

      expect(spectator.service.deleteCalendar$).toBeObservable(expected);
      spectator.service.deleteCalendar$.subscribe(() => {
        expect(mockCalendarDataService.delete).toHaveBeenCalledWith(
          mockDialogReturnValue.id,
        );
      });
    });

    it('should trigger the deleteCalendarGameEvents action with the response obtained by the offlineDataService based on the dialog input to delete the active calendar and its user-created game events when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.deleteCalendarGameEvents(
          mockCalendarToBeDeleted.id,
          userCreatedGameEventIds,
        ),
      });

      mockActions$ = hot('-a', { a: AppActions.deleteCalendar() });

      expect(spectator.service.deleteCalendar$).toBeObservable(expected);
      spectator.service.deleteCalendar$.subscribe(() => {
        expect(mockOfflineDataService.deleteCalendar).toHaveBeenCalledWith(
          mockDialogReturnValue.id,
        );
      });
    });
  });

  describe('createGameEvent$', () => {
    const mockGameEventToBeCreated: UnsavedGameEvent = {
      title: 'Collect Kegs',
      tag: Tag.Artisan,
      description: 'Pumpkin kegs.',
      type: Type.User,
      gameDate: { day: 1, year: 1, isRecurring: false, season: Season.FALL },
    };
    const mockSelectedDate: SelectedDate = {
      day: 1,
      season: Season.SPRING,
      year: 2,
    };
    const mockExistingEvents: GameEvent[] = MOCK_GAME_EVENTS;
    const mockDialogReturnValue = { gameEvent: mockGameEventToBeCreated };
    const mockGameEventResponseFromApi: GameEvent = {
      ...mockGameEventToBeCreated,
      gameDate: { ...mockGameEventToBeCreated.gameDate, id: '1' },
      publishedAt: '',
      id: '1',
    };

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(
        AppFeature.selectSelectedDate,
        mockSelectedDate,
      );
      mockStore.overrideSelector(
        AppFeature.selectActiveDayEvents,
        mockExistingEvents,
      );

      mockGameEventDataService.create.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      mockOfflineDataService.createGameEvent.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      setMockDialogToReturn<{ gameEvent: UnsavedGameEvent }>(
        mockDialogReturnValue,
      );
    });

    it('should trigger the CreateEventDialogComponent to open with the min height of 420 and with the currently selected day, season, and year, and a list of existing events created', () => {
      mockActions$ = hot('-a', { a: AppActions.createEvent() });

      spectator.service.createGameEvent$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(
          CreateEventDialogComponent,
          {
            data: {
              day: mockSelectedDate.day,
              season: mockSelectedDate.season,
              year: mockSelectedDate.year,
              existingEvents: mockExistingEvents,
              object: 'event',
            },
            minHeight: 420,
          },
        );
      });
    });

    it('should trigger the createEventSuccess action with the response obtained by the API based on the dialog input', () => {
      const expected = cold('-a', {
        a: AppActions.createEventSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', { a: AppActions.createEvent() });

      expect(spectator.service.createGameEvent$).toBeObservable(expected);
      spectator.service.createGameEvent$.subscribe(() => {
        expect(mockGameEventDataService.create).toHaveBeenCalledWith(
          mockDialogReturnValue.gameEvent,
        );
      });
    });

    it('should trigger the createEventSuccess action with the response obtained by the offlineDataService based on the dialog input when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.createEventSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', { a: AppActions.createEvent() });

      expect(spectator.service.createGameEvent$).toBeObservable(expected);
      spectator.service.createGameEvent$.subscribe(() => {
        expect(mockOfflineDataService.createGameEvent).toHaveBeenCalledWith(
          mockDialogReturnValue.gameEvent,
        );
      });
    });
  });

  describe('createSeasonGoal$', () => {
    const mockSeasonGoalToBeCreated: UnsavedGameEvent = {
      title: 'Collect Kegs',
      tag: Tag.Artisan,
      description: 'Pumpkin kegs.',
      type: Type.User,
      gameDate: { day: 10, year: 1, isRecurring: false, season: Season.FALL },
    };
    const mockSelectedDate: SelectedDate = {
      day: 1,
      season: Season.SPRING,
      year: 2,
    };
    const mockExistingGoals: GameEvent[] = MOCK_GAME_EVENTS;
    const mockDialogReturnValue = { gameEvent: mockSeasonGoalToBeCreated };
    const mockGameEventResponseFromApi: GameEvent = {
      ...mockSeasonGoalToBeCreated,
      gameDate: { ...mockSeasonGoalToBeCreated.gameDate, id: '1' },
      publishedAt: '',
      id: '1',
    };

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(
        AppFeature.selectSelectedDate,
        mockSelectedDate,
      );
      mockStore.overrideSelector(
        AppFeature.selectActiveSeasonGoals,
        mockExistingGoals,
      );

      mockGameEventDataService.create.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      mockOfflineDataService.createGameEvent.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      setMockDialogToReturn<{ gameEvent: UnsavedGameEvent }>(
        mockDialogReturnValue,
      );
    });

    it('should trigger the CreateEventDialogComponent to open with the min height of 420 and with day 0, season, and year, and a list of existing events created', () => {
      mockActions$ = hot('-a', { a: AppActions.createGoal() });

      spectator.service.createSeasonGoal$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(
          CreateEventDialogComponent,
          {
            data: {
              day: 0,
              season: mockSelectedDate.season,
              year: mockSelectedDate.year,
              existingEvents: mockExistingGoals,
              object: 'goal',
            },
            minHeight: 420,
          },
        );
      });
    });

    it('should trigger the createGoalSuccess action with the response obtained by the API based on the dialog input', () => {
      const expected = cold('-a', {
        a: AppActions.createGoalSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', { a: AppActions.createGoal() });

      expect(spectator.service.createSeasonGoal$).toBeObservable(expected);
      spectator.service.createSeasonGoal$.subscribe(() => {
        expect(mockGameEventDataService.create).toHaveBeenCalledWith(
          mockDialogReturnValue.gameEvent,
        );
      });
    });

    it('should trigger the createGoalSuccess action with the response obtained by the offlineDataService based on the dialog input when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.createGoalSuccess(mockGameEventResponseFromApi),
      });

      mockActions$ = hot('-a', { a: AppActions.createGoal() });

      expect(spectator.service.createSeasonGoal$).toBeObservable(expected);
      spectator.service.createSeasonGoal$.subscribe(() => {
        expect(mockOfflineDataService.createGameEvent).toHaveBeenCalledWith(
          mockDialogReturnValue.gameEvent,
        );
      });
    });
  });

  describe('updateCalendarDetails$', () => {
    const mockCurrentlyActiveCalendar: Calendar = MOCK_CALENDARS[0];
    const mockAvailableCalendars: Calendar[] = MOCK_CALENDARS;
    const mockSelectedDate: SelectedDate = {
      day: 1,
      season: Season.SPRING,
      year: 2,
    };
    const mockDialogReturnValue = {
      calendar: {
        ...MOCK_CALENDARS[0],
        title: 'Updated Calendar Name',
        description: 'Updated calendar description.',
      },
      year: 1,
      fullActiveCalendar: mockCurrentlyActiveCalendar,
    };
    const mockCalendarResponseFromApi: Calendar =
      mockDialogReturnValue.calendar;

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(
        AppFeature.selectSelectedDate,
        mockSelectedDate,
      );
      mockStore.overrideSelector(
        AppFeature.selectActiveCalendar,
        mockCurrentlyActiveCalendar,
      );
      mockStore.overrideSelector(
        AppFeature.selectAvailableCalendars,
        mockAvailableCalendars,
      );

      mockCalendarDataService.updateDetails.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
      mockOfflineDataService.updateCalendarDetails.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
      setMockDialogToReturn<{
        fullActiveCalendar: Calendar;
        calendar: Calendar;
        year: number;
      }>(mockDialogReturnValue);
    });

    it('should trigger the EditCalendarDialogComponent to open with the currently opened calendar, active year, and a list of existing calendar names', () => {
      mockActions$ = hot('-a', { a: AppActions.updateCalendar() });

      spectator.service.updateCalendarDetails$.subscribe(() => {
        expect(mockDialog.open).toHaveBeenCalledWith(
          EditCalendarDialogComponent,
          {
            data: {
              activeCalendar: mockCurrentlyActiveCalendar,
              year: mockSelectedDate.year,
              existingCalendars: mockAvailableCalendars.map((e) => e.name),
            },
          },
        );
      });
    });

    it('should trigger the updateCalendarSuccess action with the response obtained by the API based on the dialog input', () => {
      const expected = cold('-a', {
        a: AppActions.updateCalendarSuccess(
          mockCalendarResponseFromApi,
          mockDialogReturnValue.year,
        ),
      });

      mockActions$ = hot('-a', { a: AppActions.updateCalendar() });

      expect(spectator.service.updateCalendarDetails$).toBeObservable(expected);
      spectator.service.updateCalendarDetails$.subscribe(() => {
        expect(mockCalendarDataService.updateDetails).toHaveBeenCalledWith(
          mockDialogReturnValue.calendar,
        );
      });
    });

    it('should trigger the updateCalendarSuccess action with the response obtained by the offlineDataService based on the dialog input and full reference to active calendar when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.updateCalendarSuccess(
          mockCalendarResponseFromApi,
          mockDialogReturnValue.year,
        ),
      });

      mockActions$ = hot('-a', { a: AppActions.updateCalendar() });

      expect(spectator.service.updateCalendarDetails$).toBeObservable(expected);
      spectator.service.updateCalendarDetails$.subscribe(() => {
        expect(
          mockOfflineDataService.updateCalendarDetails,
        ).toHaveBeenCalledWith(
          mockDialogReturnValue.calendar,
          mockDialogReturnValue.fullActiveCalendar,
        );
      });
    });
  });

  describe('addEventToCurrentCalendar$', () => {
    const mockEventCreated: GameEvent = MOCK_GAME_EVENTS[0];
    const mockCurrentlyActiveCalendar: Calendar = MOCK_CALENDARS[0];
    const mockCalendarResponseFromApi: Calendar = {
      ...MOCK_CALENDARS[0],
      gameEvents: [...MOCK_CALENDARS[0].gameEvents, mockEventCreated],
    };

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(
        AppFeature.selectActiveCalendar,
        mockCurrentlyActiveCalendar,
      );

      mockCalendarDataService.updateEvents.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
      mockOfflineDataService.updateCalendarEvents.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
    });

    it('should trigger the addedEventToCalendar action with the response obtained by the API', () => {
      const expected = cold('-a', {
        a: AppActions.addedEventToCalendar(
          mockCalendarResponseFromApi,
          mockEventCreated,
        ),
      });

      mockActions$ = hot('-a', {
        a: AppActions.createEventSuccess(mockEventCreated),
      });

      expect(spectator.service.addEventToCurrentCalendar$).toBeObservable(
        expected,
      );
      spectator.service.addEventToCurrentCalendar$.subscribe(() => {
        expect(mockCalendarDataService.updateEvents).toHaveBeenCalledWith({
          id: mockCurrentlyActiveCalendar.id,
          gameEvents: [...MOCK_CALENDARS[0].gameEvents, mockEventCreated],
        });
      });
    });

    it('should trigger the addedEventToCalendar action with the response obtained by the offlineDataService when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.addedEventToCalendar(
          mockCalendarResponseFromApi,
          mockEventCreated,
        ),
      });

      mockActions$ = hot('-a', {
        a: AppActions.createEventSuccess(mockEventCreated),
      });

      expect(spectator.service.addEventToCurrentCalendar$).toBeObservable(
        expected,
      );
      spectator.service.addEventToCurrentCalendar$.subscribe(() => {
        expect(
          mockOfflineDataService.updateCalendarEvents,
        ).toHaveBeenCalledWith(
          {
            id: mockCurrentlyActiveCalendar.id,
            gameEvents: [...MOCK_CALENDARS[0].gameEvents, mockEventCreated],
          },
          mockCurrentlyActiveCalendar,
        );
      });
    });
  });

  describe('addGoalToCurrentCalendar$', () => {
    const mockGoalCreated: GameEvent = {
      ...MOCK_GAME_EVENTS[0],
      gameDate: { ...MOCK_GAME_EVENTS[0].gameDate, day: 0 },
    };
    const mockCurrentlyActiveCalendar: Calendar = MOCK_CALENDARS[0];
    const mockCalendarResponseFromApi: Calendar = {
      ...MOCK_CALENDARS[0],
      gameEvents: [...MOCK_CALENDARS[0].gameEvents, mockGoalCreated],
    };

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(
        AppFeature.selectActiveCalendar,
        mockCurrentlyActiveCalendar,
      );

      mockCalendarDataService.updateEvents.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
      mockOfflineDataService.updateCalendarEvents.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
    });

    it('should trigger the addedGoalToCalendar action with the response obtained by the API', () => {
      const expected = cold('-a', {
        a: AppActions.addedGoalToCalendar(
          mockCalendarResponseFromApi,
          mockGoalCreated,
        ),
      });

      mockActions$ = hot('-a', {
        a: AppActions.createGoalSuccess(mockGoalCreated),
      });

      expect(spectator.service.addGoalToCurrentCalendar$).toBeObservable(
        expected,
      );
      spectator.service.addGoalToCurrentCalendar$.subscribe(() => {
        expect(mockCalendarDataService.updateEvents).toHaveBeenCalledWith({
          id: mockCurrentlyActiveCalendar.id,
          gameEvents: [...MOCK_CALENDARS[0].gameEvents, mockGoalCreated],
        });
      });
    });

    it('should trigger the addedEventToCalendar action with the response obtained by the offlineDataService when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.addedGoalToCalendar(
          mockCalendarResponseFromApi,
          mockGoalCreated,
        ),
      });

      mockActions$ = hot('-a', {
        a: AppActions.createGoalSuccess(mockGoalCreated),
      });

      expect(spectator.service.addGoalToCurrentCalendar$).toBeObservable(
        expected,
      );
      spectator.service.addGoalToCurrentCalendar$.subscribe(() => {
        expect(
          mockOfflineDataService.updateCalendarEvents,
        ).toHaveBeenCalledWith(
          {
            id: mockCurrentlyActiveCalendar.id,
            gameEvents: [...MOCK_CALENDARS[0].gameEvents, mockGoalCreated],
          },
          mockCurrentlyActiveCalendar,
        );
      });
    });
  });

  describe('createUploadedCalendar$', () => {
    const mockDownloadedCalendar: DownloadedCalendar = {
      name: 'Mock Downloaded Calendar',
      description: 'Testing upload and download capability.',
      gameEvents: MOCK_GAME_EVENTS,
      systemConfig: {
        includeBirthdays: false,
        includeCrops: true,
        includeFestivals: false,
      },
    };
    const mockCalendarResponseFromApi: Calendar = {
      ...mockDownloadedCalendar,
      id: '1',
      filteredGameEvents: [],
      publishedAt: '',
    };
    const mockAvailableCalendars: Calendar[] = MOCK_CALENDARS;

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
      mockStore.overrideSelector(
        AppFeature.selectAvailableCalendars,
        mockAvailableCalendars,
      );

      mockCalendarDataService.create.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
      mockOfflineDataService.createCalendar.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
    });

    it('should trigger the createUploadedCalendarBaseSuccess action with the response obtained by the API and name the calendar with an increment indicator [x]', () => {
      const expected = cold('-a', {
        a: AppActions.createUploadedCalendarBaseSuccess(
          mockCalendarResponseFromApi,
          mockDownloadedCalendar.gameEvents,
        ),
      });

      mockActions$ = hot('-a', {
        a: AppActions.createUploadedCalendar(mockDownloadedCalendar),
      });

      expect(spectator.service.createUploadedCalendar$).toBeObservable(
        expected,
      );
      spectator.service.createUploadedCalendar$.subscribe(() => {
        expect(mockCalendarDataService.create).toHaveBeenCalledWith(
          `${mockDownloadedCalendar.name}`,
          mockDownloadedCalendar.description,
          mockDownloadedCalendar.systemConfig.includeBirthdays,
          mockDownloadedCalendar.systemConfig.includeFestivals,
          mockDownloadedCalendar.systemConfig.includeCrops,
        );
      });
    });

    it('should trigger the createUploadedCalendarBaseSuccess action with the response obtained by the offlineDataService when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.createUploadedCalendarBaseSuccess(
          mockCalendarResponseFromApi,
          mockDownloadedCalendar.gameEvents,
        ),
      });

      mockActions$ = hot('-a', {
        a: AppActions.createUploadedCalendar(mockDownloadedCalendar),
      });

      expect(spectator.service.createUploadedCalendar$).toBeObservable(
        expected,
      );
      spectator.service.createUploadedCalendar$.subscribe(() => {
        expect(mockOfflineDataService.createCalendar).toHaveBeenCalledWith(
          `${mockDownloadedCalendar.name}`,
          mockDownloadedCalendar.description,
          mockDownloadedCalendar.systemConfig.includeBirthdays,
          mockDownloadedCalendar.systemConfig.includeFestivals,
          mockDownloadedCalendar.systemConfig.includeCrops,
        );
      });
    });
  });

  describe('createEventsForUploadedCalendar$', () => {
    const mockDownloadedCalendar: Calendar = {
      name: 'Mock Downloaded Calendar',
      description: 'Testing upload and download capability.',
      gameEvents: MOCK_GAME_EVENTS,
      systemConfig: {
        includeBirthdays: false,
        includeCrops: true,
        includeFestivals: false,
      },
      id: '1',
      filteredGameEvents: [],
      publishedAt: '',
    };
    const mockGameEventResponseFromApi: GameEvent[] = MOCK_GAME_EVENTS;

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);

      mockGameEventDataService.createMultiple.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
      mockOfflineDataService.createMultipleGameEvents.mockReturnValue(
        of(mockGameEventResponseFromApi),
      );
    });

    it('should trigger the createUploadedCalendarEventsSuccess action with the response obtained by the API', () => {
      const expected = cold('-a', {
        a: AppActions.createUploadedCalendarEventsSuccess(
          mockDownloadedCalendar,
          mockGameEventResponseFromApi,
        ),
      });

      mockActions$ = hot('-a', {
        a: AppActions.createUploadedCalendarBaseSuccess(
          mockDownloadedCalendar,
          mockGameEventResponseFromApi,
        ),
      });

      expect(spectator.service.createEventsForUploadedCalendar$).toBeObservable(
        expected,
      );
      spectator.service.createEventsForUploadedCalendar$.subscribe(() => {
        expect(mockGameEventDataService.createMultiple).toHaveBeenCalledWith(
          mockDownloadedCalendar.gameEvents,
        );
      });
    });

    it('should trigger the createUploadedCalendarEventsSuccess action with the response obtained by the offlineDataService when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.createUploadedCalendarEventsSuccess(
          mockDownloadedCalendar,
          mockGameEventResponseFromApi,
        ),
      });

      mockActions$ = hot('-a', {
        a: AppActions.createUploadedCalendarBaseSuccess(
          mockDownloadedCalendar,
          mockGameEventResponseFromApi,
        ),
      });

      expect(spectator.service.createEventsForUploadedCalendar$).toBeObservable(
        expected,
      );
      spectator.service.createEventsForUploadedCalendar$.subscribe(() => {
        expect(
          mockOfflineDataService.createMultipleGameEvents,
        ).toHaveBeenCalledWith(mockDownloadedCalendar.gameEvents);
      });
    });
  });

  describe('addGameEventsToUploadedCalendar$', () => {
    const mockCreatedCalendar: Calendar = MOCK_CALENDARS[0];
    const mockCreatedEvents: GameEvent[] = MOCK_GAME_EVENTS;
    const mockUpdatedCalendarWithCreatedEvents = {
      id: mockCreatedCalendar.id,
      gameEvents: mockCreatedEvents,
    };
    const mockCalendarResponseFromApi: Calendar = {
      ...mockUpdatedCalendarWithCreatedEvents,
      name: mockCreatedCalendar.name,
      systemConfig: mockCreatedCalendar.systemConfig,
      filteredGameEvents: [],
      description: 'Description from API.',
      publishedAt: '',
    };

    beforeEach(() => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);

      mockCalendarDataService.updateEvents.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
      mockOfflineDataService.updateCalendarEvents.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );
    });

    it('should trigger the createCalendarSuccess action with the response obtained by the API', () => {
      const expected = cold('-a', {
        a: AppActions.createCalendarSuccess(mockCalendarResponseFromApi),
      });

      mockActions$ = hot('-a', {
        a: AppActions.createUploadedCalendarEventsSuccess(
          mockCreatedCalendar,
          mockCreatedEvents,
        ),
      });

      expect(spectator.service.addGameEventsToUploadedCalendar$).toBeObservable(
        expected,
      );
      spectator.service.addGameEventsToUploadedCalendar$.subscribe(() => {
        expect(mockCalendarDataService.updateEvents).toHaveBeenCalledWith(
          mockUpdatedCalendarWithCreatedEvents,
        );
      });
    });

    it('should trigger the createCalendarSuccess action with the response obtained by the offlineDataService when in offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.createCalendarSuccess(mockCalendarResponseFromApi),
      });

      mockActions$ = hot('-a', {
        a: AppActions.createUploadedCalendarEventsSuccess(
          mockCreatedCalendar,
          mockCreatedEvents,
        ),
      });

      expect(spectator.service.addGameEventsToUploadedCalendar$).toBeObservable(
        expected,
      );
      spectator.service.addGameEventsToUploadedCalendar$.subscribe(() => {
        expect(
          mockOfflineDataService.updateCalendarEvents,
        ).toHaveBeenCalledWith(
          mockUpdatedCalendarWithCreatedEvents,
          mockCreatedCalendar,
        );
      });
    });
  });

  describe('updateSystemEvents$', () => {
    it('should trigger the gameEventDataService to update all the system events and trigger the updatedSystemEventsSuccess event when done', () => {
      const mockUpdatedSystemEvents: GameEvent[] = MOCK_GAME_EVENTS;
      const expected = cold('-a', {
        a: AppActions.updatedSystemEventsSuccess(),
      });
      mockGameEventDataService.updateSystem.mockReturnValue(
        of(mockUpdatedSystemEvents),
      );

      expect(spectator.service.updateSystemEvents$).toBeObservable(expected);
      spectator.service.updateSystemEvents$.subscribe(() => {
        expect(mockCalendarDataService.getAll).toHaveBeenCalled();
      });

      mockActions$ = hot('-a', { a: AppActions.updateSystemEvents() });
    });
  });
});
