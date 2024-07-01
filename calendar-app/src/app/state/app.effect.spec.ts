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
import { AppStore } from '../models/app-store.model';
import { Story } from '../models/story.model';
import { User } from '../models/user.model';
import { LoggerService } from '../services/logger/logger.service';
import { StoryDataService } from '../services/story/story-data.service';
import { UserDataService } from '../services/user/user-data.service';
import { AppActions } from './app.actions';
import { AppEffects } from './app.effect';
import { AppFeature } from './app.state';

describe('AppEffects', () => {
  const mockUsers: User[] = [
    {
      name: 'John',
      favouriteStories: [{ title: 'Matilda', author: 'Roald Dahl' }],
    },
    {
      name: 'Jane',
      favouriteStories: [{ title: 'Fantastic Mr. Fox', author: 'Roald Dahl' }],
    },
  ];
  const mockStories: Story[] = [
    {
      title: 'Story1',
      author: 'A1',
    },
    {
      title: 'Story2',
      author: 'A2',
    },
    { title: 'Matilda', author: 'Roald Dahl' },
    { title: 'Fantastic Mr. Fox', author: 'Roald Dahl' },
  ];

  let spectator: SpectatorService<AppEffects>;
  let mockActions$ = new Observable<Action>();
  let mockUserDataService: SpyObject<UserDataService>;
  let mockStoryDataService: SpyObject<StoryDataService>;
  let mockLoggerService: SpyObject<LoggerService>;
  let mockStore: MockStore<AppStore>;

  const createService = createServiceFactory({
    service: AppEffects,
    providers: [
      provideMockActions(() => mockActions$),
      provideMockStore({
        selectors: [
          { selector: AppFeature.selectActiveUser, value: mockUsers[0] },
        ],
      }),
    ],
    mocks: [UserDataService, StoryDataService, LoggerService],
  });

  beforeEach(() => {
    spectator = createService();
    mockUserDataService = spectator.inject(UserDataService);
    mockStoryDataService = spectator.inject(StoryDataService);
    mockLoggerService = spectator.inject(LoggerService);
    mockStore = spectator.inject(MockStore);
  });

  describe('loadApp$', () => {
    it('should trigger getUsers and getStories action', () => {
      mockActions$ = hot('-a', { a: AppActions.loadApp() });
      const expected = cold('-(ab)', {
        a: AppActions.getUsers(),
        b: AppActions.getStories(),
      });

      expect(spectator.service.loadApp$).toBeObservable(expected);
    });
  });

  describe('getUsers$', () => {
    it('should call on the userDataService to get a list of users and trigger getUsersSuccess action', () => {
      const storeSpy = jest.spyOn(mockStore, 'dispatch');

      mockActions$ = hot('-a', { a: AppActions.getUsers() });
      const expected = cold('-a', {
        a: AppActions.getUsersSuccess(mockUsers),
      });
      mockUserDataService.getUsers.mockReturnValue(of(mockUsers));

      expect(spectator.service.getUsers$).toBeObservable(expected);
      spectator.service.getUsers$.subscribe(() => {
        expect(mockUserDataService.getUsers()).toHaveBeenCalled();
        expect(storeSpy).toHaveBeenCalledWith(AppActions.loadComplete());
      });
    });
    it('should trigger getUsersFailure action if the call to the userDataService fails', () => {
      const mockError = { message: 'Error' };
      mockUserDataService.getUsers.mockReturnValue(throwError(() => mockError));
      mockActions$ = hot('-a', { a: AppActions.getUsers() });
      const expected = cold('-(a|)', {
        a: AppActions.getUsersFailure(mockError.message),
      });

      expect(spectator.service.getUsers$).toBeObservable(expected);
    });
  });

  describe('getStories$', () => {
    it('should call on the storyDataService to get a list of users and trigger getStoriesSuccess action', () => {
      mockActions$ = hot('-a', { a: AppActions.getStories() });
      const expected = cold('-a', {
        a: AppActions.getStoriesSuccess(mockStories),
      });
      mockStoryDataService.getStories.mockReturnValue(of(mockStories));

      expect(spectator.service.getStories$).toBeObservable(expected);
      spectator.service.getStories$.subscribe(() => {
        expect(mockStoryDataService.getStories()).toHaveBeenCalled();
      });
    });
    it('should trigger getStoriesFailure action if the call to the userDataService fails', () => {
      const mockError = { message: 'Error' };
      mockStoryDataService.getStories.mockReturnValue(
        throwError(() => mockError)
      );
      mockActions$ = hot('-a', { a: AppActions.getStories() });
      const expected = cold('-(a|)', {
        a: AppActions.getStoriesFailure(mockError.message),
      });

      expect(spectator.service.getStories$).toBeObservable(expected);
    });
  });

  describe('notification$', () => {
    it('should call on the logService to log user and action', () => {
      const expected = { user: null, action: AppActions.loadApp };
      spectator.service.notification$.subscribe(() => {
        expect(mockLoggerService.log()).toHaveBeenCalledWith(
          expected.user,
          expected.action
        );
      });

      mockStore.overrideSelector(AppFeature.selectActiveUser, null);
      mockActions$ = hot('-a', { a: expected.action() });
    });
  });
});
