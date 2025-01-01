import { Calendar_Data } from '../../../src/app/services/models/calendar';
import { MOCK_GAME_EVENT_RESPONSE } from './system-event-response.mock';

export const MOCK_CALENDARS_RESPONSE: {
  calendars: { data: Calendar_Data[] };
} = {
  calendars: {
    data: [
      {
        id: '38',
        attributes: {
          name: 'Test Calendar 1',
          description: 'Test Description',
          systemConfig: {
            includeBirthdays: true,
            includeFestivals: false,
            includeCrops: true,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          gameEvents: { data: [MOCK_GAME_EVENT_RESPONSE] },
        },
      },
      {
        id: '39',
        attributes: {
          name: 'Test Calendar 2',
          description: 'Test Description',
          systemConfig: {
            includeBirthdays: true,
            includeFestivals: false,
            includeCrops: true,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          gameEvents: { data: [MOCK_GAME_EVENT_RESPONSE] },
        },
      },
    ],
  },
};
