import { Story } from '../models/story.model';
import { User } from '../models/user.model';
import { AppFeature } from './app.state';

describe('Extra Selectors', () => {
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
  describe('selectNonFavouritedStories', () => {
    it('should return a list of stories that are not favourited by the current active user', () => {
      const activeUser = mockUsers[0];
      const expected: Story[] = mockStories.filter(
        (story) => story.title !== activeUser.favouriteStories[0].title
      );

      expect(
        AppFeature.selectNonFavouritedStories.projector(activeUser, mockStories)
      ).toStrictEqual(expected);
    });
  });

  describe('selectFavouritedStories', () => {
    it('should return a list of the active users favourite stories', () => {
      const activeUser = mockUsers[0];
      const expected: Story[] = activeUser.favouriteStories;

      expect(
        AppFeature.selectFavouritedStories.projector(activeUser)
      ).toStrictEqual(expected);
    });
  });
});
