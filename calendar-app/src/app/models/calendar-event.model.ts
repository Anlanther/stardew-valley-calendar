import { GameDate, UnsavedGameDate } from './game-date.model';
import { Tag } from './tag.model';

export interface CalendarEvent {
  id: string;
  title: string;
  tag: Tag;
  description: string;
  gameDate: GameDate;
  publishedAt: string;
}

export type UnsavedCalendarEvent = Omit<
  CalendarEvent,
  'id' | 'publishedAt' | 'gameDate'
> & {
  gameDate: UnsavedGameDate;
};
