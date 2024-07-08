import { CalendarEvent } from '../models/calendar-event.model';
import { DeepPartial } from '../models/deep-partial.model';

const SPRING_CROPS_DEADLINE: DeepPartial<CalendarEvent>[] = [];
const SUMMER_CROPS_DEADLINE: DeepPartial<CalendarEvent>[] = [];
const FALL_CROPS_DEADLINE: DeepPartial<CalendarEvent>[] = [];
const WINTER_CROPS_DEADLINE: DeepPartial<CalendarEvent>[] = [];

export const CROPS_DEADLINES: DeepPartial<CalendarEvent>[] = [
  ...SPRING_CROPS_DEADLINE,
  ...SUMMER_CROPS_DEADLINE,
  ...FALL_CROPS_DEADLINE,
  ...WINTER_CROPS_DEADLINE,
];
