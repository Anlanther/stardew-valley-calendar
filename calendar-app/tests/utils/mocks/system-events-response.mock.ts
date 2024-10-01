import { DeepPartial } from '../../../src/app/models/deep-partial.model';
import { Season } from '../../../src/app/models/season.model';
import { Tag } from '../../../src/app/models/tag.model';
import {
  GameEvent_Data,
  Type,
} from '../../../src/app/services/models/game-event';

export const MOCK_SYSTEM_EVENTS_RESPONSE: {
  gameEvents: { data: DeepPartial<GameEvent_Data>[] };
} = {
  gameEvents: {
    data: [
      {
        id: '331',
        attributes: {
          title: "Abigail's Birthday",
          description: '',
          tag: Tag.Abigail,
          type: Type.SystemBirthdays,
          gameDate: {
            id: '337',
            season: Season.FALL,
            day: 13,
            isRecurring: true,
          },
        },
      },
      {
        id: '332',
        attributes: {
          title: "Alex's Birthday",
          description: '',
          tag: Tag.Alex,
          type: Type.SystemBirthdays,
          gameDate: {
            id: '338',
            season: Season.WINTER,
            day: 13,
            isRecurring: true,
          },
        },
      },
    ],
  },
};
