import { UnsavedCalendar } from '../../src/app/models/calendar.model';

export const MOCK_CALENDAR_TO_CREATE: UnsavedCalendar = {
  name: 'Mock Calendar',
  description: 'This is a mock calendar for Playwright tests.',
  filteredGameEvents: [],
  gameEvents: [],
  systemConfig: {
    includeBirthdays: false,
    includeCrops: false,
    includeFestivals: false,
  },
};
