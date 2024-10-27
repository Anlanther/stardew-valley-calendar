import { Calendar } from '../../../src/app/models/calendar.model';

export const MOCK_CALENDARS: Calendar[] = [
  {
    id: '1',
    publishedAt: '',
    name: 'Mock Calendar 1',
    description: 'This is a mock calendar for tests.',
    filteredGameEvents: [],
    gameEvents: [],
    systemConfig: {
      includeBirthdays: false,
      includeCrops: false,
      includeFestivals: false,
    },
  },
  {
    id: '2',
    publishedAt: '',
    name: 'Mock Calendar 2',
    description: 'This is a second mock calendar for tests.',
    filteredGameEvents: [],
    gameEvents: [],
    systemConfig: {
      includeBirthdays: false,
      includeCrops: false,
      includeFestivals: false,
    },
  },
];
