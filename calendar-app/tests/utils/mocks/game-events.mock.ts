import { Tag } from '../../../src/app/constants/tag.constant';
import { Type } from '../../../src/app/constants/type.constant';
import { GameEvent } from '../../../src/app/models/game-event.model';
import { Season } from '../../../src/app/models/season.model';

export const MOCK_GAME_EVENTS: GameEvent[] = [
  {
    id: '1',
    publishedAt: '',
    title: 'Fish for Legendary',
    description: 'Only available when raining.',
    tag: Tag.Fishing,
    gameDate: {
      isRecurring: false,
      year: 2,
      day: 13,
      season: Season.FALL,
      id: '1',
    },
    type: Type.User,
  },
  {
    id: '2',
    publishedAt: '',
    title: 'Go Mining',
    description: 'Need 30 iron ores.',
    tag: Tag.Fishing,
    gameDate: {
      isRecurring: false,
      year: 3,
      day: 12,
      season: Season.WINTER,
      id: '2',
    },
    type: Type.User,
  },
  {
    id: '3',
    publishedAt: '',
    title: `Caroline's Birthday`,
    description: 'Buy gem.',
    tag: Tag.Caroline,
    gameDate: { isRecurring: true, day: 1, season: Season.WINTER, id: '2' },
    type: Type.SystemBirthdays,
  },
  {
    id: '4',
    publishedAt: '',
    title: 'Feast of the Winter Star',
    description: 'Prepare gift.',
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 1, season: Season.WINTER, id: '2' },
    type: Type.SystemFestivals,
  },
  {
    id: '5',
    publishedAt: '',
    title: 'Harvest Stawberries',
    description: 'Sell and plant more immediately.',
    tag: Tag.Farming,
    gameDate: {
      isRecurring: false,
      year: 4,
      day: 1,
      season: Season.WINTER,
      id: '2',
    },
    type: Type.SystemCrops,
  },
];
