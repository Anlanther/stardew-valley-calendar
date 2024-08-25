import { UnsavedGameEvent } from '../../src/app/models/game-event.model';
import { Season } from '../../src/app/models/season.model';
import { Tag } from '../../src/app/models/tag.model';
import { Type } from '../../src/app/models/type.model';

export const MOCK_CROP_EVENTS: UnsavedGameEvent[] = [
  {
    title: 'LAST DAY: Blue Jazz',
    description: `Sells for 50g.\n7 days to harvest.`,
    tag: Tag.BlueJazz,
    gameDate: { isRecurring: true, day: 21, season: Season.SPRING },
    type: Type.SystemCrops,
  },
  {
    title: 'LAST DAY: Blueberry',
    description: 'Sells for 50g.\n13 days to harvest.',
    tag: Tag.Blueberry,
    gameDate: { isRecurring: true, day: 15, season: Season.SUMMER },
    type: Type.SystemCrops,
  },
  {
    title: 'LAST DAY: Wheat',
    description: 'Sells for 25g.\n4 days to harvest.',
    tag: Tag.Wheat,
    gameDate: { isRecurring: true, day: 24, season: Season.FALL },
    type: Type.SystemCrops,
  },
];
