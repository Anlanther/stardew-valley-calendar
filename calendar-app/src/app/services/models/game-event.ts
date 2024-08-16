// Interface automatically generated by schemas-to-ts
import {
  GameDateComponent,
  GameDateComponent_NoRelations,
  GameDateComponent_Plain,
} from './GameDateComponent';

export enum Tag {
  Crop = 'crop',
  Gift = 'gift',
  Building = 'building',
  Festival = 'festival',
  Abigail = 'abigail',
  Alex = 'alex',
  Caroline = 'caroline',
  Clint = 'clint',
  Demetrius = 'demetrius',
  Dwarf = 'dwarf',
  Elliott = 'elliott',
  Emily = 'emily',
  Evelyn = 'evelyn',
  George = 'george',
  Gus = 'gus',
  Haley = 'haley',
  Harvey = 'harvey',
  Jas = 'jas',
  Jodi = 'jodi',
  Kent = 'kent',
  Krobus = 'krobus',
  Leah = 'leah',
  Leo = 'leo',
  Lewis = 'lewis',
  Linus = 'linus',
  Marlon = 'marlon',
  Marnie = 'marnie',
  Maru = 'maru',
  Morris = 'morris',
  Pam = 'pam',
  Penny = 'penny',
  Pierre = 'pierre',
  Robin = 'robin',
  Sam = 'sam',
  Sandy = 'sandy',
  Sebastian = 'sebastian',
  Shane = 'shane',
  Vincent = 'vincent',
  Willy = 'willy',
  Wizard = 'wizard',
}

export enum Type {
  SystemBirthdays = 'system_birthdays',
  SystemCrops = 'system_crops',
  SystemFestivals = 'system_festivals',
  User = 'user',
}
export interface GameEvent_Data {
  id: string;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    title: string;
    description: string;
    tag: Tag;
    gameDate: GameDateComponent;
    type: Type;
  };
}
export interface GameEvent_Plain {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  title: string;
  description: string;
  tag: Tag;
  gameDate: GameDateComponent_Plain;
  type: Type;
}

export interface GameEvent_NoRelations {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  title: string;
  description: string;
  tag: Tag;
  gameDate: GameDateComponent_NoRelations;
  type: Type;
}

export interface GameEvent_AdminPanelLifeCycle {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  title: string;
  description: string;
  tag: Tag;
  gameDate: GameDateComponent_Plain;
  type: Type;
}
