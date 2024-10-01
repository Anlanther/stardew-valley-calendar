import { GameEvent } from '../../../src/app/models/game-event.model';
import { Season } from '../../../src/app/models/season.model';
import { Tag } from '../../../src/app/models/tag.model';
import { Type } from '../../../src/app/models/type.model';

export const MOCK_GAME_EVENTS: GameEvent[] = [
  {
    id: '1',
    publishedAt: '',
    title: 'Fish for Legendary',
    description: 'Only available when raining.',
    tag: Tag.Fishing,
    gameDate: { isRecurring: true, day: 13, season: Season.FALL, id: '1' },
    type: Type.User,
  },
  {
    id: '2',
    publishedAt: '',
    title: 'Go Mining',
    description: 'Need 30 iron ores.',
    tag: Tag.Fishing,
    gameDate: { isRecurring: true, day: 1, season: Season.WINTER, id: '2' },
    type: Type.User,
  },
];
