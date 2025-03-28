import { Tag } from '../../../src/app/constants/tag.constant';
import { Type } from '../../../src/app/constants/type.constant';
import { UnsavedGameEvent } from '../../../src/app/models/game-event.model';
import { Season } from '../../../src/app/models/season.model';

export const MOCK_FESTIVAL_EVENTS: UnsavedGameEvent[] = [
  {
    title: 'Egg Festival',
    description:
      'Like other festivals, the event lasts for most of the day and consists of two parts: a social portion and an Egg Hunt activity to finish the day. To take part, enter Pelican Town Square between 9am and 2pm. (It is impossible to enter the town before 9am; attempting to enter will say that the event is still being set up.) The festival will end immediately after the Egg Hunt or if the player leaves the Town, returning them to The Farm at 10pm.',
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 13, season: Season.SPRING },
    type: Type.SystemFestivals,
  },
  {
    title: 'Luau',
    description:
      'The player attends the Luau by entering The Beach between 9am and 2pm. The beach cannot be entered before 9am. When the Luau ends, the player will be returned to The Farm at 10pm.',
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 11, season: Season.SUMMER },
    type: Type.SystemFestivals,
  },
  {
    title: `Spirit's Eve`,
    description: `The player enters the festival by entering Pelican Town between 10:00 pm and 11:50 pm (note that at 11:50 pm it is too late to enter), and upon leaving the festival, the player is returned to The Farm at 12:00 am.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 27, season: Season.FALL },
    type: Type.SystemFestivals,
  },
  {
    title: `Festival of Ice`,
    description: `The player attends the festival by entering Cindersap Forest between 9am and 2pm. When the festival ends, the player will be returned to The Farm at 10pm.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 8, season: Season.WINTER },
    type: Type.SystemFestivals,
  },
];
