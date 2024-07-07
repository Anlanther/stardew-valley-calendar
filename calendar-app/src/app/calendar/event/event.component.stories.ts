import { MatListModule } from '@angular/material/list';
import {
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
} from '@storybook/angular';
import { Season } from '../../models/season.model';
import { Tag } from '../../models/tag.model';
import { EventComponent } from './event.component';

const meta: Meta<EventComponent> = {
  component: EventComponent,
  title: 'Event Component',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatListModule],
    }),
    componentWrapperDecorator(
      (story) =>
        `<div style="margin: 3em; outline: solid grey 1px;
  min-width: 50px;">${story}</div>`,
    ),
  ],
};

export default meta;
type Story = StoryObj<EventComponent>;

export const Default: Story = {
  args: {
    day: 1,
    year: 1,
    season: Season.FALL,
    calendar: {
      id: '1',
      name: '',
      calendarEvents: [
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
          tag: Tag.Sebastian,
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
      ],
      publishedAt: '',
    },
  },
};