import { Tag } from '../../../src/app/constants/tag.constant';
import { Season } from '../../../src/app/models/season.model';
import {
  GameEvent_Data,
  Type,
} from '../../../src/app/services/models/game-event';

export const MOCK_GAME_EVENT_RESPONSE: GameEvent_Data = {
  id: '1',
  attributes: {
    title: 'Fish for Legendary',
    description: '',
    createdAt: '',
    updatedAt: '',
    tag: Tag.Fishing,
    type: Type.User,
    gameDate: {
      id: '337',
      season: Season.FALL,
      day: 13,
      isRecurring: false,
    },
  },
};
