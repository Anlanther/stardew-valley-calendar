import { GameEvent } from './game-event.model';

export interface Calendar {
  id: string;
  name: string;
  gameEvents: GameEvent[];
  publishedAt: string;
}
