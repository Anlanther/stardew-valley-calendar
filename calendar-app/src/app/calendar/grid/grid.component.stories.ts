import { StoreModule } from '@ngrx/store';
import {
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
} from '@storybook/angular';
import { Season } from '../../models/season.model';
import { Tag } from '../../models/tag.model';
import { EventComponent } from '../event/event.component';
import { GridComponent } from './grid.component';

const meta: Meta<GridComponent> = {
  component: GridComponent,
  title: 'Grid Component',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [EventComponent, StoreModule.forRoot({})],
    }),
    componentWrapperDecorator(
      (story) => `<div style="margin: 3em;">${story}</div>`,
    ),
  ],
};

export default meta;
type Story = StoryObj<GridComponent>;

export const Default: Story = {
  args: {
    season: Season.FALL,
    activeCalendar: {
      id: '1',
      name: 'Active Calendar',
      calendarEvents: [
        {
          id: '1',
          description: '',
          tag: Tag.Festival,
          title: 'An Event',
          gameDate: {
            id: '1',
            day: 1,
            isRecurring: false,
            year: 1,
            season: Season.FALL,
          },
        },
        {
          id: '1',
          description: '',
          tag: Tag.Abigail,
          title: 'An Event',
          gameDate: {
            id: '1',
            day: 1,
            isRecurring: false,
            year: 1,
            season: Season.FALL,
          },
        },
        {
          id: '1',
          description: '',
          tag: Tag.Building,
          title: 'An Event',
          gameDate: {
            id: '1',
            day: 1,
            isRecurring: false,
            year: 1,
            season: Season.FALL,
          },
        },
        {
          id: '1',
          description: '',
          tag: Tag.MrQi,
          title: 'An Event',
          gameDate: {
            id: '1',
            day: 1,
            isRecurring: false,
            year: 1,
            season: Season.FALL,
          },
        },
      ],
      publishedAt: '',
    },
  },
};
