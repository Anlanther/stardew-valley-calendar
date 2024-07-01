import type { Schema, Attribute } from '@strapi/strapi';

export interface CalendarEvent extends Schema.Component {
  collectionName: 'components_calendar_events';
  info: {
    displayName: 'Event';
    icon: 'calendar';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    priority: Attribute.Enumeration<['game', 'high', 'medium', 'low']> &
      Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    player: Attribute.String;
    dueDate: Attribute.Component<'calendar.game-date'>;
  };
}

export interface CalendarGameDate extends Schema.Component {
  collectionName: 'components_calendar_game_dates';
  info: {
    displayName: 'Game Date';
    icon: 'calendar';
    description: '';
  };
  attributes: {
    season: Attribute.Enumeration<['spring', 'summer', 'fall', 'winter']> &
      Attribute.Required;
    day: Attribute.Integer & Attribute.Required;
    year: Attribute.Integer & Attribute.Required;
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
