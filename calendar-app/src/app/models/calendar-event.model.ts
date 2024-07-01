import { GameDate } from './game-date.model';
import { Tag } from './tag.model';

export interface CalendarEvent {
  title: string;
  tag: Tag;
  description: string;
  dueDate?: GameDate;
  gameDate: GameDate;
}
