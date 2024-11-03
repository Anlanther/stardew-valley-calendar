import { TagCategory } from '../../../src/app/models/tag-category.model';
import { Tag } from '../../../src/app/models/tag.model';
import { EventForm } from '../../models/event-form.model';

export const MOCK_EVENT_FORM: EventForm = {
  title: 'Mining Day',
  description: 'Try to get to floor 50 in the mines',
  tag: Tag.Mining,
  tagCategory: TagCategory.ACTIVITY,
  isRecurring: false,
};
