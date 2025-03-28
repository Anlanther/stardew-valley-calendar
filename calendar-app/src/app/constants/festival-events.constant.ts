import { UnsavedGameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { Tag } from './tag.constant';
import { Type } from './type.constant';

export const FESTIVAL_EVENTS: UnsavedGameEvent[] = [
  {
    title: 'Egg Festival',
    description:
      'Like other festivals, the event lasts for most of the day and consists of two parts: a social portion and an Egg Hunt activity to finish the day. To take part, enter Pelican Town Square between 9am and 2pm. (It is impossible to enter the town before 9am; attempting to enter will say that the event is still being set up.) The festival will end immediately after the Egg Hunt or if the player leaves the Town, returning them to The Farm at 10pm.',
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 13, season: Season.SPRING },
    type: Type.SystemFestivals,
  },
  {
    title: 'Desert Festival Day 1',
    description:
      'The festival officially starts at 10am each day, and requires the Bus to be repaired in order to visit the festival.',
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 15, season: Season.SPRING },
    type: Type.SystemFestivals,
  },
  {
    title: 'Desert Festival Day 2',
    description:
      'The festival officially starts at 10am each day, and requires the Bus to be repaired in order to visit the festival.',
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 16, season: Season.SPRING },
    type: Type.SystemFestivals,
  },
  {
    title: 'Desert Festival Day 3',
    description:
      'The festival officially starts at 10am each day, and requires the Bus to be repaired in order to visit the festival.',
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 17, season: Season.SPRING },
    type: Type.SystemFestivals,
  },
  {
    title: 'Flower Dance',
    description:
      'The player enters the dance by entering Cindersap Forest between 9am and 2pm. The forest cannot be entered before 9am.',
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 24, season: Season.SPRING },
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
    title: 'Trout Derby Day 1',
    description: `The festival begins at 6:10am and ends at 2:00am on both days. The festival takes place in Cindersap Forest by the river near Marnie's Ranch. During the festival, players can fish in the river to catch Rainbow Trout, which can be caught all day long and regardless of weather.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 20, season: Season.SUMMER },
    type: Type.SystemFestivals,
  },
  {
    title: 'Trout Derby Day 2',
    description: `The festival begins at 6:10am and ends at 2:00am on both days. The festival takes place in Cindersap Forest by the river near Marnie's Ranch. During the festival, players can fish in the river to catch Rainbow Trout, which can be caught all day long and regardless of weather.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 21, season: Season.SUMMER },
    type: Type.SystemFestivals,
  },
  {
    title: 'Dance of the Moonlight Jellies',
    description: `The player can choose to attend the festival by entering the area between 10 pm and 12 am at the beach. When the festival ends, they will be returned to The Farm at midnight.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 28, season: Season.SUMMER },
    type: Type.SystemFestivals,
  },
  {
    title: 'Stardew Valley Fair',
    description: `The player attends the fair by entering Pelican Town between 9am and 3pm. When the player leaves the festival, they will be returned to The Farm at 10pm.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 16, season: Season.FALL },
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
  {
    title: `SquidFest Day 1`,
    description: `The festival begins at 6:10am and ends at 2:00am on both days. During the festival, Squid can be caught all day long. Catching certain amounts of squid will earn the player prizes.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 12, season: Season.WINTER },
    type: Type.SystemFestivals,
  },
  {
    title: `SquidFest Day 2`,
    description: `The festival begins at 6:10am and ends at 2:00am on both days. During the festival, Squid can be caught all day long. Catching certain amounts of squid will earn the player prizes.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 13, season: Season.WINTER },
    type: Type.SystemFestivals,
  },
  {
    title: `Night Market Day 1`,
    description: `Various boats and merchants will appear at the docks on the Beach, and offer to sell goods or take the player for a boat ride. The Night Market is open between 5pm and 2am, but the Submarine Ride closes at 11pm, and the Mermaid Boat closes at 12:30am.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 15, season: Season.WINTER },
    type: Type.SystemFestivals,
  },
  {
    title: `Night Market Day 2`,
    description: `Various boats and merchants will appear at the docks on the Beach, and offer to sell goods or take the player for a boat ride. The Night Market is open between 5pm and 2am, but the Submarine Ride closes at 11pm, and the Mermaid Boat closes at 12:30am.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 16, season: Season.WINTER },
    type: Type.SystemFestivals,
  },
  {
    title: `Night Market Day 3`,
    description: `Various boats and merchants will appear at the docks on the Beach, and offer to sell goods or take the player for a boat ride. The Night Market is open between 5pm and 2am, but the Submarine Ride closes at 11pm, and the Mermaid Boat closes at 12:30am.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 17, season: Season.WINTER },
    type: Type.SystemFestivals,
  },
  {
    title: `Feast of the Winter Star`,
    description: `The player attends the festival by entering Pelican Town between 9am and 2pm. When the player leaves the festival, they will be returned to The Farm at 10pm.`,
    tag: Tag.Festival,
    gameDate: { isRecurring: true, day: 25, season: Season.WINTER },
    type: Type.SystemFestivals,
  },
];
