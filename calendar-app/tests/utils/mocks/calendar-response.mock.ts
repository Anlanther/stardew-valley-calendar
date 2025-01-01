import { Calendar_Data } from '../../../src/app/services/models/calendar';
import { MOCK_GAME_EVENT_RESPONSE } from './system-event-response.mock';

export const MOCK_CALENDAR_RESPONSE: Calendar_Data = {
  id: '1',
  attributes: {
    name: 'Test Calendar',
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
};
