import { DeepPartial } from '../../src/app/models/deep-partial.model';
import { Calendar_Data } from '../../src/app/services/models/calendar';

export const MOCK_CALENDARS: {
  calendars: { data: DeepPartial<Calendar_Data>[] };
} = {
  calendars: {
    data: [
      {
        id: '38',
        attributes: {
          name: 'aurora',
        },
      },
      {
        id: '39',
        attributes: {
          name: 'sad bye calendar',
        },
      },
    ],
  },
};
