// Interface automatically generated by schemas-to-ts

import { Event } from '../../../../components/calendar/interfaces/Event';
import { Calendar } from '../../../calendar/content-types/calendar/calendar';
import { Event_Plain } from '../../../../components/calendar/interfaces/Event';
import { Calendar_Plain } from '../../../calendar/content-types/calendar/calendar';
import { Event_NoRelations } from '../../../../components/calendar/interfaces/Event';
import { AdminPanelRelationPropertyModification } from '../../../../common/schemas-to-ts/AdminPanelRelationPropertyModification';

export interface CalendarEvent {
  id: number;
  attributes: {
    createdAt: Date;    updatedAt: Date;    publishedAt?: Date;    event: Event;
    calendar?: { data: Calendar };
  };
}
export interface CalendarEvent_Plain {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  event: Event_Plain;
  calendar?: Calendar_Plain;
}

export interface CalendarEvent_NoRelations {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  event: Event_NoRelations;
  calendar?: number;
}

export interface CalendarEvent_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;  updatedAt: Date;  publishedAt?: Date;  event: Event_Plain;
  calendar?: AdminPanelRelationPropertyModification<Calendar_Plain>;
}
