import { TagCategory } from '../constants/tag-category.constant';

export interface TagMetadata {
  url: string;
  category: TagCategory;
  displayName: string;
}
