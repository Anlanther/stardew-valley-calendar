import { CommonModule } from '@angular/common';
import { provideMockStore } from '@ngrx/store/testing';
import {
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
} from '@storybook/angular';
import { initialState } from '../../../state/app.reducer';
import { EventComponent } from '../event/event.component';
import { GridComponent } from './grid.component';

const meta: Meta<GridComponent> = {
  component: GridComponent,
  title: 'Grid Component',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [GridComponent, EventComponent],
      imports: [CommonModule],
      providers: [provideMockStore({ initialState })],
    }),
    componentWrapperDecorator(
      (story) => `<div style="margin: 3em;">${story}</div>`,
    ),
  ],
};

export default meta;
type Story = StoryObj<GridComponent>;

export const Default: Story = {
  args: {},
};
