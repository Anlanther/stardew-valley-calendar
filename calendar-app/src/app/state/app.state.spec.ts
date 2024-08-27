import { Season } from '../models/season.model';
import { SelectedDate } from '../models/selected-date.model';
import { AppFeature } from './app.state';

describe('Extra Selectors', () => {
  describe('selectSelectedDateString', () => {
    it('should return string with day and season on it with correct case', () => {
      const selectedDate: SelectedDate = {
        day: 1,
        season: Season.FALL,
        year: 2,
      };
      const expected = `1 Fall`;

      expect(
        AppFeature.selectSelectedDateString.projector(selectedDate),
      ).toEqual(expected);
    });
  });
});
