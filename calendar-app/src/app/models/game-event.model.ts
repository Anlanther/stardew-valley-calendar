import { Tag } from '../constants/tag.constant';
import { Type } from '../constants/type.constant';
import { GameDate, UnsavedGameDate } from './game-date.model';

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
