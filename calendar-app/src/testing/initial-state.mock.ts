import { Season } from '../app/models/season.model';
import { StatusMessage } from '../app/models/status-message.model';
import { Tag } from '../app/models/tag.model';
import { Type } from '../app/models/type.model';
import { AppState } from '../app/state/app.reducer';

export const initialState: AppState = {
  activeCalendar: {
    id: '33',
    name: 't1',
    publishedAt: '',
    gameEvents: [
      {
        id: '228',
        title: "Abigail's Birthday",
        description: '',
        tag: Tag.Abigail,
        publishedAt: '',
        type: Type.SystemBirthdays,
        gameDate: {
          id: '234',
          day: 13,
          isRecurring: true,
          season: Season.FALL,
        },
      },
    ],
  },
  activeFormEvents: null,
  selectedYear: 1,
  selectedDay: 1,
  selectedSeason: Season.FALL,
  availableCalendars: [],
  savedSystemEvents: [],
  statusMessage: StatusMessage.NO_API_ACCESS,
  navBarOpen: false,
};
