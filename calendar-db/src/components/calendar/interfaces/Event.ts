// Interface automatically generated by schemas-to-ts

import { GameDate } from './GameDate';
import { GameDate_Plain } from './GameDate';
import { GameDate_NoRelations } from './GameDate';

export enum Tag {
  HighPriority = 'highPriority',
  MediumPriority = 'mediumPriority',
  LowPriority = 'lowPriority',}

export interface Event {
  title: string;
  description: string;
  dueDate?: GameDate;
  gameDate: GameDate;
  tag: Tag;
}
export interface Event_Plain {
  title: string;
  description: string;
  dueDate?: GameDate_Plain;
  gameDate: GameDate_Plain;
  tag: Tag;
}

export interface Event_NoRelations {
  title: string;
  description: string;
  dueDate?: GameDate_NoRelations;
  gameDate: GameDate_NoRelations;
  tag: Tag;
}

