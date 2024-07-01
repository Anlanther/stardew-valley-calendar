import { Event_NoRelations, Event_Plain } from './event';
import { GameDate, GameDate_NoRelations, GameDate_Plain } from './game-date';

export interface Calendar {
  id: number;
  attributes: {
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    event: Event[];
    gameDate: GameDate;
  };
}
export interface Calendar_Plain {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  event: Event_Plain[];
  gameDate: GameDate_Plain;
}

export interface Calendar_NoRelations {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  event: Event_NoRelations[];
  gameDate: GameDate_NoRelations;
}

export interface Calendar_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  event: Event_Plain[];
  gameDate: GameDate_Plain;
}
