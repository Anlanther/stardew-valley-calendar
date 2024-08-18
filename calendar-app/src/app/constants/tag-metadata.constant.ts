import { TagCategory } from '../models/tag-category.model';
import { TagMetadata } from '../models/tag-metadata.model';
import { Tag } from '../models/tag.model';

export const TAG_METADATA: Map<Tag, TagMetadata> = new Map([
  [Tag.Gift, { category: TagCategory.ACTIVITY, url: 'gift-icon.png' }],
  [Tag.Fishing, { category: TagCategory.ACTIVITY, url: 'gift-icon.png' }],
  [Tag.Mining, { category: TagCategory.ACTIVITY, url: 'mining-icon.png' }],
  [Tag.Artisan, { category: TagCategory.ACTIVITY, url: 'artisan-icon.png' }],
  [Tag.Crop, { category: TagCategory.CROP, url: 'parsnip-icon.png' }],
  [Tag.Building, { category: TagCategory.ACTIVITY, url: 'barn-icon.png' }],
  [
    Tag.Festival,
    { category: TagCategory.ACTIVITY, url: 'calendar-flag-icon.png' },
  ],
  [Tag.Abigail, { category: TagCategory.CHARACTER, url: 'abigail-icon.png' }],
  [Tag.Alex, { category: TagCategory.CHARACTER, url: 'alex-icon.png' }],
  [Tag.Caroline, { category: TagCategory.CHARACTER, url: 'caroline-icon.png' }],
  [Tag.Clint, { category: TagCategory.CHARACTER, url: 'clint-icon.png' }],
  [
    Tag.Demetrius,
    { category: TagCategory.CHARACTER, url: 'demetrius-icon.png' },
  ],
  [Tag.Dwarf, { category: TagCategory.CHARACTER, url: 'dwarf-icon.png' }],
  [Tag.Elliott, { category: TagCategory.CHARACTER, url: 'elliott-icon.png' }],
  [Tag.Emily, { category: TagCategory.CHARACTER, url: 'emily-icon.png' }],
  [Tag.Evelyn, { category: TagCategory.CHARACTER, url: 'evelyn-icon.png' }],
  [Tag.George, { category: TagCategory.CHARACTER, url: 'george-icon.png' }],
  [Tag.Gus, { category: TagCategory.CHARACTER, url: 'gus-icon.png' }],
  [Tag.Haley, { category: TagCategory.CHARACTER, url: 'haley-icon.png' }],
  [Tag.Harvey, { category: TagCategory.CHARACTER, url: 'harvey-icon.png' }],
  [Tag.Jas, { category: TagCategory.CHARACTER, url: 'jas-icon.png' }],
  [Tag.Jodi, { category: TagCategory.CHARACTER, url: 'jodi-icon.png' }],
  [Tag.Kent, { category: TagCategory.CHARACTER, url: 'kent-icon.png' }],
  [Tag.Krobus, { category: TagCategory.CHARACTER, url: 'krobus-icon.png' }],
  [Tag.Leah, { category: TagCategory.CHARACTER, url: 'leah-icon.png' }],
  [Tag.Leo, { category: TagCategory.CHARACTER, url: 'leo-icon.png' }],
  [Tag.Lewis, { category: TagCategory.CHARACTER, url: 'lewis-icon.png' }],
  [Tag.Linus, { category: TagCategory.CHARACTER, url: 'linus-icon.png' }],
  [Tag.Marlon, { category: TagCategory.CHARACTER, url: 'marlon-icon.png' }],
  [Tag.Marnie, { category: TagCategory.CHARACTER, url: 'marnie-icon.png' }],
  [Tag.Maru, { category: TagCategory.CHARACTER, url: 'maru-icon.png' }],
  [Tag.Morris, { category: TagCategory.CHARACTER, url: 'morris-icon.png' }],
  [Tag.Pam, { category: TagCategory.CHARACTER, url: 'pam-icon.png' }],
  [Tag.Penny, { category: TagCategory.CHARACTER, url: 'penny-icon.png' }],
  [Tag.Pierre, { category: TagCategory.CHARACTER, url: 'pierre-icon.png' }],
  [Tag.Robin, { category: TagCategory.CHARACTER, url: 'robin-icon.png' }],
  [Tag.Sam, { category: TagCategory.CHARACTER, url: 'sam-icon.png' }],
  [Tag.Sandy, { category: TagCategory.CHARACTER, url: 'sandy-icon.png' }],
  [
    Tag.Sebastian,
    { category: TagCategory.CHARACTER, url: 'sebastian-icon.png' },
  ],
  [Tag.Shane, { category: TagCategory.CHARACTER, url: 'shane-icon.png' }],
  [Tag.Vincent, { category: TagCategory.CHARACTER, url: 'vincent-icon.png' }],
  [Tag.Willy, { category: TagCategory.CHARACTER, url: 'willy-icon.png' }],
  [Tag.Wizard, { category: TagCategory.CHARACTER, url: 'wizard-icon.png' }],
]);
