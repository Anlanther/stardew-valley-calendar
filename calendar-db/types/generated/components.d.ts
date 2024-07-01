import type { Schema, Attribute } from '@strapi/strapi';

export interface CalendarEvent extends Schema.Component {
  collectionName: 'components_calendar_events';
  info: {
    displayName: 'Event';
    icon: 'calendar';
    description: '';
  };
  attributes: {
    Title: Attribute.String;
    priority: Attribute.Enumeration<['game', 'high', 'medium', 'low']>;
    description: Attribute.Text;
    player: Attribute.String;
    dueDate: Attribute.Component<'calendar.game-date'>;
  };
}

export interface CalendarGameDate extends Schema.Component {
  collectionName: 'components_calendar_game_dates';
  info: {
    displayName: 'Game Date';
    icon: 'calendar';
  };
  attributes: {
    season: Attribute.Enumeration<['spring', 'summer', 'fall', 'winter']>;
    day: Attribute.Integer;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'calendar.event': CalendarEvent;
      'calendar.game-date': CalendarGameDate;
    }
  }
}
