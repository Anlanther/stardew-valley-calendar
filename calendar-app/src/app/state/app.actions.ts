import { createActionGroup } from '@ngrx/store';
import { Calendar } from '../models/calendar.model';

export const AppActions = createActionGroup({
  source: 'App',
  events: {
    'Create Calendar': (name: string) => ({ name }),
    'Create Calendar Success': (calendar: Calendar) => ({ calendar }),
  },
});
