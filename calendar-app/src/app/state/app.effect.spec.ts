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

  const createService = createServiceFactory({
    service: AppEffects,
    providers: [
      provideMockActions(() => mockActions$),
      provideMockStore({
        selectors: [],
      }),
    ],
    mocks: [
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
        expect(mockCalendarDataService.getAll()).toHaveBeenCalled();
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
        expect(mockOfflineDataService.getAllCalendars()).toHaveBeenCalled();
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

  // describe('loadApp$', () => {
  //   it('should trigger getUsers and getStories action', () => {
  //     mockActions$ = hot('-a', { a: AppActions.loadApp() });
  //     const expected = cold('-(ab)', {
  //       a: AppActions.getUsers(),
  //       b: AppActions.getStories(),
  //     });

  //     expect(spectator.service.loadApp$).toBeObservable(expected);
  //   });
  // });

  // describe('getUsers$', () => {
  //   it('should call on the userDataService to get a list of users and trigger getUsersSuccess action', () => {
  //     const storeSpy = jest.spyOn(mockStore, 'dispatch');

  //     mockActions$ = hot('-a', { a: AppActions.getUsers() });
  //     const expected = cold('-a', {
  //       a: AppActions.getUsersSuccess(mockUsers),
  //     });
  //     mockUserDataService.getUsers.mockReturnValue(of(mockUsers));

  //     expect(spectator.service.getUsers$).toBeObservable(expected);
  //     spectator.service.getUsers$.subscribe(() => {
  //       expect(mockUserDataService.getUsers()).toHaveBeenCalled();
  //       expect(storeSpy).toHaveBeenCalledWith(AppActions.loadComplete());
  //     });
  //   });
  //   it('should trigger getUsersFailure action if the call to the userDataService fails', () => {
  //     const mockError = { message: 'Error' };
  //     mockUserDataService.getUsers.mockReturnValue(throwError(() => mockError));
  //     mockActions$ = hot('-a', { a: AppActions.getUsers() });
  //     const expected = cold('-(a|)', {
  //       a: AppActions.getUsersFailure(mockError.message),
  //     });

  //     expect(spectator.service.getUsers$).toBeObservable(expected);
  //   });
  // });

  // describe('getStories$', () => {
  //   it('should call on the storyDataService to get a list of users and trigger getStoriesSuccess action', () => {
  //     mockActions$ = hot('-a', { a: AppActions.getStories() });
  //     const expected = cold('-a', {
  //       a: AppActions.getStoriesSuccess(mockStories),
  //     });
  //     mockStoryDataService.getStories.mockReturnValue(of(mockStories));

  //     expect(spectator.service.getStories$).toBeObservable(expected);
  //     spectator.service.getStories$.subscribe(() => {
  //       expect(mockStoryDataService.getStories()).toHaveBeenCalled();
  //     });
  //   });
  //   it('should trigger getStoriesFailure action if the call to the userDataService fails', () => {
  //     const mockError = { message: 'Error' };
  //     mockStoryDataService.getStories.mockReturnValue(
  //       throwError(() => mockError),
  //     );
  //     mockActions$ = hot('-a', { a: AppActions.getStories() });
  //     const expected = cold('-(a|)', {
  //       a: AppActions.getStoriesFailure(mockError.message),
  //     });

  //     expect(spectator.service.getStories$).toBeObservable(expected);
  //   });
  // });

  // describe('notification$', () => {
  //   it('should call on the logService to log user and action', () => {
  //     const expected = { user: null, action: AppActions.loadApp };
  //     spectator.service.notification$.subscribe(() => {
  //       expect(mockLoggerService.log()).toHaveBeenCalledWith(
  //         expected.user,
  //         expected.action,
  //       );
  //     });

  //     mockStore.overrideSelector(AppFeature.selectActiveUser, null);
  //     mockActions$ = hot('-a', { a: expected.action() });
  //   });
  // });
});
