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

export interface CalendarGameEvent extends Schema.Component {
  collectionName: 'components_calendar_events';
  info: {
    displayName: 'Game Event';
    icon: 'calendar';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
    dueDate: Attribute.Component<'calendar.game-date'>;
    gameDate: Attribute.Component<'calendar.game-date'> & Attribute.Required;
    tag: Attribute.Enumeration<
      [
        'crop',
        'birthday',
        'building',
        'festival',
        'abigail',
        'alex',
        'birdie',
        'bouncer',
        'caroline',
        'clint',
        'demetrius',
        'dwarf',
        'elliott',
        'emily',
        'evelyn',
        'george',
        'gil',
        'governor',
        'grandpa',
        'gunther',
        'gus',
        'haley',
        'harvey',
        'jas',
        'jodi',
        'kent',
        'krobus',
        'leah',
        'leo',
        'lewis',
        'linus',
        'marlon',
        'marnie',
        'maru',
        'morris',
        'mr. qi',
        'pam',
        'penny',
        'pierre',
        'robin',
        'sam',
        'sandy',
        'sebastian',
        'shane',
        'vincent',
        'willy',
        'wizard'
      ]
    > &
      Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'calendar.game-date': CalendarGameDate;
      'calendar.game-event': CalendarGameEvent;
    }
  }
}
