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
import { TokenDialogComponent } from '../components/dialogs/token/token-dialog.component';
import { AppStore } from '../models/app-store.model';
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
    it('should trigger get calendar and create default events action when the app is set to offline mode', () => {
      mockActions$ = hot('-a', { a: AppActions.setOfflineMode() });
      const expected = cold('-(ab)', {
        a: AppActions.getCalendars(),
        b: AppActions.createDefaultGameEvents(),
      });

      expect(spectator.service.initialise$).toBeObservable(expected);
    });
  });

  describe('getAllCalendars$', () => {
    it('should call on getCalendarsSuccess with a list of calendars obtained from calendar data service when the app is not on offline mode', () => {
      const mockCalendarsResponseFromApi = MOCK_CALENDARS;
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);

      const expected = cold('-a', {
        a: AppActions.getCalendarsSuccess(mockCalendarsResponseFromApi),
      });
      mockCalendarDataService.getAll.mockReturnValue(
        of(mockCalendarsResponseFromApi),
      );

      expect(spectator.service.getAllCalendars$).toBeObservable(expected);
      spectator.service.getAllCalendars$.subscribe(() => {
        expect(mockCalendarDataService.getAll).toHaveBeenCalled();
      });

      mockActions$ = hot('-a', { a: AppActions.getCalendars() });
    });
    it('should call on getCalendarsSuccess with a list of calendars obtained from offline data service when the app is on offline mode', () => {
      const mockCalendarsResponseFromApi = MOCK_CALENDARS;
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);

      const expected = cold('-a', {
        a: AppActions.getCalendarsSuccess(mockCalendarsResponseFromApi),
      });
      mockOfflineDataService.getAllCalendars.mockReturnValue(
        of(mockCalendarsResponseFromApi),
      );

      expect(spectator.service.getAllCalendars$).toBeObservable(expected);
      spectator.service.getAllCalendars$.subscribe(() => {
        expect(mockOfflineDataService.getAllCalendars).toHaveBeenCalled();
      });

      mockActions$ = hot('-a', { a: AppActions.getCalendars() });
    });
    it('should trigger aPIFailed action when calendar data service fails', () => {
      const mockError = { message: 'Error' };
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
    const mockCalendarResponseFromApi = MOCK_CALENDARS[0];
    const mockExistingCalendars = [MOCK_CALENDARS[1]];
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
      setMockDialogToReturn<{
        name: string;
        includeBirthdays: boolean;
        includeFestivals: boolean;
        includeCrops: boolean;
        description: string;
      }>(mockDialogReturnValue);
    });

    it('should open the CreateCalendarDialogComponent with a list of existing calendar names with the min height of 360', () => {
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
    it('should call on createCalendarSuccess after API finished creating calendar with the dialog input data if API is available', () => {
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
    it('should call on createCalendarSuccess with a created calendar obtained from offline data service when the app is on offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);
      mockOfflineDataService.createCalendar.mockReturnValue(
        of(mockCalendarResponseFromApi),
      );

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
    it('should trigger the token dialog to open and when user inputted value is confirmed pass it to the dataService to set for the rest of the session and trigger the app to initialise', () => {
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
    const mockGameEventResponseFromApi = MOCK_GAME_EVENTS;
    it('should trigger gameEventDataService API to get or create default game events when createDefaultGameEvents and updateSystemEventsSuccess actions are called', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, false);
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

      mockActions$ = hot('-a', { a: AppActions.updatedSystemEventsSuccess() });

      expect(spectator.service.getOrCreateSystemEvents$).toBeObservable(
        expected,
      );
      spectator.service.getOrCreateSystemEvents$.subscribe(() => {
        expect(mockGameEventDataService.getOrCreateDefaults).toHaveBeenCalled();
      });
    });
    it('should trigger offlineDataService API to get or create default game events when createDefaultGameEvents and updateSystemEventsSuccess actions are called and app is set to offline mode', () => {
      mockStore.overrideSelector(AppFeature.selectOfflineMode, true);
      mockOfflineDataService.getOrCreateEventDefaults.mockReturnValue(
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
        expect(
          mockOfflineDataService.getOrCreateEventDefaults,
        ).toHaveBeenCalled();
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
  });
});
