import { Calendar } from '../../src/app/models/calendar.model';

export const CALENDAR_MOCKS: Calendar[] = [
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
];
