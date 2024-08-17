import { GameDate, UnsavedGameDate } from './game-date.model';
import { Tag } from './tag.model';
import { Type } from './type.model';

export interface GameEvent {
  id: string;
  title: string;
  tag: Tag;
  description: string;
  gameDate: GameDate;
  publishedAt: string;
  type: Type;
}

export type UnsavedGameEvent = Omit<
  GameEvent,
  'id' | 'publishedAt' | 'gameDate'
> & {
  gameDate: UnsavedGameDate;
};
