import { Tag } from '../../../src/app/constants/tag.constant';
import { Type } from '../../../src/app/constants/type.constant';
import { GameEvent } from '../../../src/app/models/game-event.model';
import { Season } from '../../../src/app/models/season.model';

export const MOCK_GOAL_EVENTS: GameEvent[] = [
  {
    id: '1',
    publishedAt: '',
    title: 'Get Fishing Level 10',
    description: 'Need a lot of exp.',
    tag: Tag.Fishing,
    gameDate: {
      isRecurring: false,
      year: 2,
      day: 0,
      season: Season.FALL,
      id: '1',
    },
    type: Type.User,
  },
  {
    id: '2',
    publishedAt: '',
    title: 'Get Mining Level 5',
    description: 'Need 30 iron ores.',
    tag: Tag.Mining,
    gameDate: {
      isRecurring: false,
      year: 3,
      day: 0,
      season: Season.WINTER,
      id: '2',
    },
    type: Type.User,
  },
  {
    id: '4',
    publishedAt: '',
    title: 'Plant Starfruit',
    description: 'Buy 500.',
    tag: Tag.Farming,
    gameDate: { isRecurring: true, day: 0, season: Season.WINTER, id: '2' },
    type: Type.User,
  },
];
