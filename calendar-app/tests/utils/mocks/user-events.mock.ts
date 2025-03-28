import { Tag } from '../../../src/app/constants/tag.constant';
import { Type } from '../../../src/app/constants/type.constant';
import { Season } from '../../../src/app/models/season.model';

export const MOCK_USER_EVENTS = [
  {
    id: '2f1fde46-935f-4eea-8b07-0b12284f982e',
    title: 'Buy Strawberries',
    description: 'Buy 600 seeds.',
    tag: Tag.Strawberry,
    publishedAt: '',
    type: Type.User,
    gameDate: {
      id: '7a514cc4-d0e6-4bf0-ae15-d004b5671a47',
      day: 13,
      isRecurring: false,
      season: Season.SPRING,
      year: 1,
    },
  },
  {
    id: '72f5488c-468e-49b2-a82c-6d09e7961954',
    title: 'Fishing Day',
    description: 'Get to fishing level 7.',
    tag: Tag.Fishing,
    publishedAt: '',
    type: Type.User,
    gameDate: {
      id: '59383f47-3ad1-42eb-8cc6-533f8ad7bfe5',
      day: 14,
      isRecurring: false,
      season: Season.SPRING,
      year: 1,
    },
  },
  {
    id: '13a69ae1-6c3d-449e-aabd-3bda94119138',
    title: 'Build fish pond',
    description: 'Add sturgeon.',
    tag: Tag.Fishing,
    publishedAt: '',
    type: Type.User,
    gameDate: {
      id: 'b3536f6e-24d0-406e-bdc4-7f65a21c897c',
      day: 3,
      isRecurring: false,
      season: Season.SUMMER,
      year: 1,
    },
  },
  {
    id: 'f968e86d-8fdf-4b05-b487-c459e50bb65c',
    title: 'Floor 100 in skull cavern',
    description: 'Secret note.',
    tag: Tag.Mining,
    publishedAt: '',
    type: Type.User,
    gameDate: {
      id: '7d73d48a-5a70-47a6-9e3d-d67cf32cedfb',
      day: 3,
      isRecurring: false,
      season: Season.SUMMER,
      year: 1,
    },
  },
  {
    id: '603ff228-faee-447c-9404-dd6d6570f8a2',
    title: 'Fall foraging bundle',
    description: '',
    tag: Tag.Gift,
    publishedAt: '',
    type: Type.User,
    gameDate: {
      id: '32dd12e3-ff7c-4467-8206-e0826414c7c3',
      day: 2,
      isRecurring: false,
      season: Season.FALL,
      year: 1,
    },
  },
  {
    id: 'c83668ad-ac4e-436d-85d2-47240a6f5d2f',
    title: 'Catch ghost fish',
    description: 'Mines',
    tag: Tag.Fishing,
    publishedAt: '',
    type: Type.User,
    gameDate: {
      id: 'd41c3907-c7cd-42ba-b6dd-23f1a7a40027',
      day: 5,
      isRecurring: false,
      season: Season.FALL,
      year: 1,
    },
  },
  {
    title: 'Skull Cavern Run',
    tag: Tag.Mining,
    description:
      'Gold or stardrop day\nEat coffee and eels\nBring 1 energy food\nBomb big rocks and hit rest\nAttack when necessary otherwise nope\nFind stairs stairs and holes',
    type: Type.User,
    gameDate: {
      day: 19,
      isRecurring: false,
      season: Season.WINTER,
      year: 1,
      id: 'b5f9dca1-9966-47c9-b61f-6dc70305a19f',
    },
    id: '699ae46d-b63f-4455-8d08-d80dbd80bf0a',
    publishedAt: '',
  },
  {
    title: 'Fish for Legend',
    tag: Tag.Fishing,
    description:
      '6am to 8pm Cindersap forest fishing at the tip of island \nUse fishing food\nUse trap bobber\nUse bait',
    type: Type.User,
    gameDate: {
      day: 17,
      isRecurring: false,
      season: Season.WINTER,
      year: 1,
      id: '99426438-ad08-4796-9290-a621c525230e',
    },
    id: '5735dda7-55ca-4003-a4df-2b32336d51c6',
    publishedAt: '',
  },
];
