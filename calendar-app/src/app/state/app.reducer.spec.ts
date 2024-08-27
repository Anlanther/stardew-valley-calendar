import { User } from '../models/user.model';
import { AppActions } from './app.actions';
import { appReducer, AppState, initialState } from './app.reducer';

describe('AppReducer', () => {
  describe(AppActions.getUsersSuccess.type, () => {
    it('should update the state', () => {
      const state: AppState = initialState;
      const action = AppActions.getUsersSuccess(mockUsers);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.getStoriesSuccess.type, () => {
    it('should update the state', () => {
      const state: AppState = initialState;
      const action = AppActions.getStoriesSuccess(mockStories);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
  describe(AppActions.setActiveUser.type, () => {
    it('should update the state', () => {
      const state: AppState = initialState;
      const mockActiveUser: User = mockUsers[0];
      const action = AppActions.setActiveUser(mockActiveUser.name);

      const actual = appReducer(state, action);

      expect(actual).toMatchSnapshot();
    });
  });
});
