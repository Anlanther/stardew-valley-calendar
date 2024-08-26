import { TagCategory } from '../../src/app/models/tag-category.model';
import { Tag } from '../../src/app/models/tag.model';

export interface EventForm {
  title: string;
  description: string;
  tag: Tag;
  tagCategory: TagCategory;
  isRecurring: boolean;
}
