// Interface automatically generated by schemas-to-ts

import { GameEvent } from '../../../game-event/content-types/game-event/game-event';
import { SystemConfigComponent } from '../../../../components/calendar/interfaces/SystemConfigComponent';
import { GameEvent_Plain } from '../../../game-event/content-types/game-event/game-event';
import { SystemConfigComponent_Plain } from '../../../../components/calendar/interfaces/SystemConfigComponent';
import { SystemConfigComponent_NoRelations } from '../../../../components/calendar/interfaces/SystemConfigComponent';
import { AdminPanelRelationPropertyModification } from '../../../../common/schemas-to-ts/AdminPanelRelationPropertyModification';

export interface Calendar {
  id: number;
  attributes: {
    createdAt: Date;    updatedAt: Date;    publishedAt?: Date;    name: string;
    gameEvents: { data: GameEvent[] };
    systemConfig: SystemConfigComponent;
    description: string;
  };
}
export interface Calendar_Plain {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  gameEvents: GameEvent_Plain[];
  systemConfig: SystemConfigComponent_Plain;
  description: string;
}

export interface Calendar_NoRelations {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  gameEvents: number[];
  systemConfig: SystemConfigComponent_NoRelations;
  description: string;
}

export interface Calendar_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  name: string;
  gameEvents: AdminPanelRelationPropertyModification<GameEvent_Plain>;
  systemConfig: SystemConfigComponent_Plain;
  description: string;
}
