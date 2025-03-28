import { Tag } from '../../../src/app/constants/tag.constant';
import { Type } from '../../../src/app/constants/type.constant';
import { UnsavedGameEvent } from '../../../src/app/models/game-event.model';
import { Season } from '../../../src/app/models/season.model';

export const MOCK_BIRTHDAY_EVENTS: UnsavedGameEvent[] = [
  {
    title: "Abigail's Birthday",
    description: '',
    tag: Tag.Abigail,
    gameDate: { isRecurring: true, day: 13, season: Season.FALL },
    type: Type.SystemBirthdays,
  },
  {
    title: "Alex's Birthday",
    description: '',
    tag: Tag.Alex,
    gameDate: { isRecurring: true, day: 13, season: Season.SUMMER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Caroline's Birthday",
    description: '',
    tag: Tag.Caroline,
    gameDate: { isRecurring: true, day: 7, season: Season.WINTER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Emily's Birthday",
    description: '',
    tag: Tag.Emily,
    gameDate: { isRecurring: true, day: 27, season: Season.SPRING },
    type: Type.SystemBirthdays,
  },
];
