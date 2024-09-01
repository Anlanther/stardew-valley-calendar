import type { Schema, Attribute } from '@strapi/strapi';

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
    year: Attribute.Integer;
    isRecurring: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
  };
}

export interface CalendarSystemConfig extends Schema.Component {
  collectionName: 'components_calendar_system_configs';
  info: {
    displayName: 'System Config';
  };
  attributes: {
    includeBirthdays: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    includeCrops: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    includeFestivals: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'calendar.game-date': CalendarGameDate;
      'calendar.system-config': CalendarSystemConfig;
    }
  }
}
