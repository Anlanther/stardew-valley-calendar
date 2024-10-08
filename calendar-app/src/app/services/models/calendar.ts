// Interface automatically generated by schemas-to-ts
import { GameEvent_Data, GameEvent_Plain } from './game-event';
import { GameEventComponent_Plain } from './GameEventComponent';
import {
  SystemConfigComponent,
  SystemConfigComponent_NoRelations,
  SystemConfigComponent_Plain,
} from './SystemConfigComponent';

export interface Calendar_Data {
  id: string;
  attributes: {
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    name: string;
    gameEvents: { data: GameEvent_Data[] };
    systemConfig: SystemConfigComponent;
    description: string;
  };
}
export interface Calendar_Plain {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  name: string;
  gameEvents: GameEvent_Plain[];
  systemConfig: SystemConfigComponent_Plain;
  description: string;
}

export interface Calendar_NoRelations {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  name: string;
  gameEvents: string[];
  systemConfig: SystemConfigComponent_NoRelations;
  description: string;
}

export interface Calendar_AdminPanelLifeCycle {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  name: string;
  gameEvents: GameEventComponent_Plain[];
  systemConfig: SystemConfigComponent_Plain;
  description: string;
}
