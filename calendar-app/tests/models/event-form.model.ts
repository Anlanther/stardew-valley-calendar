import { TagCategory } from '../../src/app/constants/tag-category.constant';
import { Tag } from '../../src/app/constants/tag.constant';

export interface EventForm {
  title: string;
  description: string;
  tag: Tag;
  tagCategory: TagCategory;
  isRecurring: boolean;
}
