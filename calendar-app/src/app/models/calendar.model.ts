import { GameEvent } from './game-event.model';
import { SystemConfig } from './system-config.model';

export interface Calendar {
  id: string;
  name: string;
  description: string;
  systemConfig: SystemConfig;
  gameEvents: GameEvent[];
  publishedAt: string;
  filteredGameEvents: GameEvent[];
}
