import { GameDate } from './game-date.model';
import { Tag } from './tag.model';

export interface CalendarEvent {
  id: string;
  title: string;
  tag: Tag;
  description: string;
  gameDate: GameDate;
  publishedAt: string;
}
