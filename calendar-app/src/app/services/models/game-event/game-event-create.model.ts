import { GameEvent_Data } from '../game-event';

export interface GameEventCreate {
  createGameEvent: { data: GameEvent_Data };
}
