import { CalendarEvent } from '../models/calendar-event.model';
import { DeepPartial } from '../models/deep-partial.model';
import { Season } from '../models/season.model';
import { Tag } from '../models/tag.model';

const SPRING_CROPS_DEADLINE: DeepPartial<CalendarEvent>[] = [
  {
    title: 'Blue LAST DAY: Jazz',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 21, season: Season.SPRING },
  },
  {
    title: 'LAST DAY: Cauliflower',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 16, season: Season.SPRING },
  },
  {
    title: 'Coffee LAST DAY: Bean',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 18, season: Season.SPRING },
  },
  {
    title: 'LAST DAY: Garlic',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 24, season: Season.SPRING },
  },
  {
    title: 'Green LAST DAY: Beans',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 18, season: Season.SPRING },
  },
  {
    title: 'LAST DAY: Kale',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 22, season: Season.SPRING },
  },
  {
    title: 'LAST DAY: Parsnip',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 24, season: Season.SPRING },
  },
  {
    title: 'LAST DAY: Potato',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 22, season: Season.SPRING },
  },
  {
    title: 'LAST DAY: Rhubarb',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 15, season: Season.SPRING },
  },
  {
    title: 'LAST DAY: Strawberry',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 20, season: Season.SPRING },
  },
  {
    title: 'LAST DAY: Tulip',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 22, season: Season.SPRING },
  },
];
const SUMMER_CROPS_DEADLINE: DeepPartial<CalendarEvent>[] = [
  {
    title: 'LAST DAY: Blueberry',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 15, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Corn',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 14, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Hops',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 17, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Hot Pepper',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 23, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Melon',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 16, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Poppy',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 21, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Radish',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 22, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Red Cabbage',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 19, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Starfruit',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 15, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Summer Spangle',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 20, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Sunflower',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 20, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Tomato',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 17, season: Season.SUMMER },
  },
  {
    title: 'LAST DAY: Wheat',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 24, season: Season.SUMMER },
  },
];
const FALL_CROPS_DEADLINE: DeepPartial<CalendarEvent>[] = [
  {
    title: 'LAST DAY: Amaranth',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 21, season: Season.FALL },
  },
  {
    title: 'LAST DAY: Artichoke',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 20, season: Season.FALL },
  },
  {
    title: 'LAST DAY: Beet',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 22, season: Season.FALL },
  },
  {
    title: 'LAST DAY: Bok Choy',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 24, season: Season.FALL },
  },
  {
    title: 'LAST DAY: Cranberries',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 21, season: Season.FALL },
  },
  {
    title: 'LAST DAY: Eggplant',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 23, season: Season.FALL },
  },
  {
    title: 'LAST DAY: Fairy Rose',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 16, season: Season.FALL },
  },
  {
    title: 'LAST DAY: Grape',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 18, season: Season.FALL },
  },
  {
    title: 'LAST DAY: Pumpkin',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 15, season: Season.FALL },
  },
  {
    title: 'LAST DAY: Yam',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 18, season: Season.FALL },
  },
];
const SPECIAL_CROPS_DEADLINE: DeepPartial<CalendarEvent>[] = [
  {
    title: 'LAST DAY: Sweet Gem Berry',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 4, season: Season.FALL },
  },
  {
    title: 'LAST DAY: Ancient Fruit',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 28, season: Season.WINTER },
  },
  {
    title: 'LAST DAY: Ancient Fruit',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 28, season: Season.SPRING },
  },
  {
    title: 'LAST DAY: Ancient Fruit',
    description: '',
    tag: Tag.Crop,
    gameDate: { isRecurring: true, day: 28, season: Season.SUMMER },
  },
];

export const CROPS_DEADLINES: DeepPartial<CalendarEvent>[] = [
  ...SPRING_CROPS_DEADLINE,
  ...SUMMER_CROPS_DEADLINE,
  ...FALL_CROPS_DEADLINE,
  ...SPECIAL_CROPS_DEADLINE,
];
