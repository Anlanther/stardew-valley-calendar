import { UnsavedGameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { Tag } from '../models/tag.model';
import { Type } from '../models/type.model';

export const BIRTHDAY_EVENTS: UnsavedGameEvent[] = [
  {
    title: "Abigail's Birthday",
    description:
      'Loves:\nAmethyst, Banana Pudding, Blackberry Cobbler, Chocolate Cake, Monster Compendium, Pufferfish, Pumpkin, Spicy Eel, Likes, Ancient Sword, Basilisk Paw, Bone Flute, Combat Quarterly\nLikes:\nQuartz',
    tag: Tag.Abigail,
    gameDate: { isRecurring: true, day: 13, season: Season.FALL },
    type: Type.SystemBirthdays,
  },
  {
    title: "Alex's Birthday",
    description:
      'Loves:\nComplete Breakfast, Jack Be Nimble, Jack Be Thick, Salmon Dinner\nLikes:\nDinosaur Egg, Field Snack, Parrot Egg',
    tag: Tag.Alex,
    gameDate: { isRecurring: true, day: 13, season: Season.SUMMER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Caroline's Birthday",
    description:
      'Loves:\nFish Taco, Green Tea, Summer Spangle, Tropical Curry\nLikes:\nDaffodil, Tea Leaves, Wild Horseradish',
    tag: Tag.Caroline,
    gameDate: { isRecurring: true, day: 7, season: Season.WINTER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Clint's Birthday",
    description:
      'Loves:\nAmethyst, Aquamarine, Artichoke Dip, Emerald, Fiddlehead Risotto, Gold Bar, Iridium Bar, Jade, Omni Geode, Ruby, Topaz\nLikes:\nCopper Bar, Iron Bar, Mining Monthly',
    tag: Tag.Clint,
    gameDate: { isRecurring: true, day: 26, season: Season.WINTER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Demetrius' Birthday",
    description:
      'Loves:\nBean Hotpot, Ice Cream, Rice Pudding, Strawberry\nLikes:\nAll Eggs except void, All fruit except strawberryDinosaur Egg, Purple Mushroom',
    tag: Tag.Demetrius,
    gameDate: { isRecurring: true, day: 19, season: Season.SUMMER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Dwarf's Birthday",
    description:
      'Loves:\nAmethyst, Aquamarine, Emerald, Jade, Lava Eel, Lemon Stone, Omni Geode, Ruby, Topaz\nLikes:\nAll Artifacts, Cave Carrot, Quartz',
    tag: Tag.Dwarf,
    gameDate: { isRecurring: true, day: 22, season: Season.SUMMER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Elliott's Birthday",
    description:
      'Loves:\nCrab Cakes, Duck Feather, Lobster, Pomegranate, Squid Ink, Tom Kha Soup\nLikes:\nAll Books, All Fruit (except Pomegranate & Salmonberry),Octopus, Squid',
    tag: Tag.Elliott,
    gameDate: { isRecurring: true, day: 5, season: Season.FALL },
    type: Type.SystemBirthdays,
  },
  {
    title: "Emily's Birthday",
    description:
      'Loves:\nAmethyst, Aquamarine, Cloth, Emerald, Jade, Parrot Egg, Ruby, Survival Burger, Topaz, Wool\nLikes:\nDaffodil, Quartz',
    tag: Tag.Emily,
    gameDate: { isRecurring: true, day: 27, season: Season.SPRING },
    type: Type.SystemBirthdays,
  },
  {
    title: "Evelyn's Birthday",
    description:
      'Loves:\nBeet, Chocolate Cake, Diamond, Fairy Rose, Raisins, Stuffing, Tulip\nLikes:\nAll Milk, Broken Glasses, Clam, Cockle, Coral, Daffodil, Mussel, Nautilus Shell, Oyster, Sea Urchin',
    tag: Tag.Evelyn,
    gameDate: { isRecurring: true, day: 20, season: Season.WINTER },
    type: Type.SystemBirthdays,
  },
  {
    title: "George's Birthday",
    description: 'Loves:\nFried Mushroom, Leek\nLikes:\nDaffodil',
    tag: Tag.George,
    gameDate: { isRecurring: true, day: 24, season: Season.FALL },
    type: Type.SystemBirthdays,
  },
  {
    title: "Gus' Birthday",
    description:
      'Loves:\nDiamond, Escargot, Fish Taco, Orange, Tropical Curry\nLikes:\nDaffodil, Truffle',
    tag: Tag.Gus,
    gameDate: { isRecurring: true, day: 8, season: Season.SUMMER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Haley's Birthday",
    description:
      'Loves:\nCoconut, Fruit Salad, Pink Cake, Sunflower\nLikes:\nDaffodil',
    tag: Tag.Haley,
    gameDate: { isRecurring: true, day: 14, season: Season.SPRING },
    type: Type.SystemBirthdays,
  },
  {
    title: "Harvey's Birthday",
    description:
      'Loves:\nCoffee, Pickles, Super Meal, Truffle Oil, Wine\nLikes:\nAll Fruit (except Salmonberry & Spice Berry),All Mushrooms (except Red),Daffodil, Dandelion, Duck Egg, Duck Feather, Ginger, Goat Milk, Hazelnut, Holly, Large Goat Milk, Leek, Quartz, Snow Yam, Spring Onion, Wild Horseradish, Winter Root',
    tag: Tag.Harvey,
    gameDate: { isRecurring: true, day: 14, season: Season.WINTER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Jas' Birthday",
    description:
      'Loves:\n Ancient Dol, Fairy Bo, Fairy Ros, Pink Cak, Plum Puddin, Strange Doll (green),Strange Doll (yellow)\nLikes:\nAll Milk, Coconut, Daffodil',
    tag: Tag.Jas,
    gameDate: { isRecurring: true, day: 4, season: Season.SUMMER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Jodi's Birthday",
    description:
      'Loves:\nChocolate Cake, Crispy Bass, Diamond, Eggplant Parmesan, Fried Eel, Pancakes, Rhubarb Pie, Vegetable Medley\nLikes:\nAll Eggs (except Void Egg),All Fruit (except Spice Berry),All Milk',
    tag: Tag.Jodi,
    gameDate: { isRecurring: true, day: 11, season: Season.FALL },
    type: Type.SystemBirthdays,
  },
  {
    title: "Kent's Birthday",
    description:
      'Loves:\nFiddlehead Risotto, Roasted Hazelnuts\nLikes:\nAll Eggs (except Void Egg),All Fruit, Daffodil, Dwarvish Safety Manual',
    tag: Tag.Kent,
    gameDate: { isRecurring: true, day: 4, season: Season.SPRING },
    type: Type.SystemBirthdays,
  },
  {
    title: "Krobus' Birthday",
    description:
      'Loves:\nDiamond, Iridium Bar, Monster Compendium, Monster Musk, Pumpkin, Void Egg, Void Mayonnaise, Wild Horseradish\nLikes:\nGold Bar, Quartz, Seafoam Pudding, Strange Bun',
    tag: Tag.Krobus,
    gameDate: { isRecurring: true, day: 1, season: Season.WINTER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Leah's Birthday",
    description:
      'Loves:\nGoat Cheese, nPoppyseed Muffin, nSalad, nStir Fry, nTruffle, nVegetable Medley, nWine\nLikes:\nAll Eggs (except Void Egg),All Fruit, All Milk, All Mushrooms (except Red),Daffodil, Dandelion, Driftwood, Ginger, Hazelnut, Holly, Leek, Snow Yam, Spring Onion, Wild Horseradish, Winter Root',
    tag: Tag.Leah,
    gameDate: { isRecurring: true, day: 23, season: Season.WINTER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Leo's Birthday",
    description:
      'Loves:\nDuck Feather, Mango, Ostrich Egg, Parrot Egg, Poi\nLikes:\nDragon Tooth, Nautilus Shell, Quartz, Rainbow Shell, Sea Urchin, Spice Berry',
    tag: Tag.Leo,
    gameDate: { isRecurring: true, day: 26, season: Season.SUMMER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Lewis' Birthday",
    description:
      "Loves:\nAutumn's Bounty, Glazed Yams, Green Tea, Hot Pepper, Vegetable Medley\nLikes:\nBlueberry, Cactus Fruit, Coconut",
    tag: Tag.Lewis,
    gameDate: { isRecurring: true, day: 7, season: Season.SPRING },
    type: Type.SystemBirthdays,
  },
  {
    title: "Linus' Birthday",
    description:
      "Loves:\nBlueberry Tart, Cactus Fruit, Coconut, Dish O' The Sea, The Alleyway Buffet, Yam\nLikes:\nAll Eggs (except Void Egg),All Fruit (except Cactus Fruit & Coconut),All Milk, All Mushrooms (except Red),Daffodil, Dandelion, Ginger, Hazelnut, Holly, Leek, Snow Yam, Spring Onion, Wild Horseradish, Winter Root",
    tag: Tag.Linus,
    gameDate: { isRecurring: true, day: 3, season: Season.WINTER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Marnie's Birthday",
    description:
      "Loves:\nDiamond, Farmer's Lunch, Pink Cake, Pumpkin Pie\nLikes:\nAll Eggs (except Void Egg),All Milk, Stardew Valley Almanac, Quartz",
    tag: Tag.Marnie,
    gameDate: { isRecurring: true, day: 18, season: Season.FALL },
    type: Type.SystemBirthdays,
  },
  {
    title: "Maru's Birthday",
    description:
      "Loves:\nBattery Pack, Cauliflower, Cheese Cauliflower, Diamond, Dwarf Gadget, Gold Bar, Iridium Bar, Miner's Treat, Pepper Poppers, Radioactive Bar, Rhubarb Pie, Strawberry\nLikes:\nAll Mushrooms (except Common & Red),Copper Bar, Iron Bar, Oak Resin, Pine Tar, Quartz, Radioactive Ore",
    tag: Tag.Maru,
    gameDate: { isRecurring: true, day: 10, season: Season.SUMMER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Pam's Birthday",
    description:
      'Loves:\nBeer, Cactus Fruit, Glazed Yams, Mead, Pale Ale, Parsnip, Parsnip Soup, Piña Colada\nLikes:\nAll Fruit (except Cactus Fruit),All Milk, Daffodil',
    tag: Tag.Pam,
    gameDate: { isRecurring: true, day: 18, season: Season.SPRING },
    type: Type.SystemBirthdays,
  },
  {
    title: "Penny's Birthday",
    description:
      'Loves:\nAll Books, Diamond, Emerald, Melon, Poppy, Poppyseed Muffin, Red Plate, Roots Platter, Sandfish, Tom Kha Soup\nLikes:\nAll Artifacts, All Milk, Dandelion, Leek',
    tag: Tag.Penny,
    gameDate: { isRecurring: true, day: 2, season: Season.FALL },
    type: Type.SystemBirthdays,
  },
  {
    title: "Pierre's Birthday",
    description:
      'Loves:\nFried Calamari, Price Catalogue\nLikes:\nAll Eggs (except Void Egg),All Milk, Daffodil, Dandelion',
    tag: Tag.Pierre,
    gameDate: { isRecurring: true, day: 26, season: Season.SPRING },
    type: Type.SystemBirthdays,
  },
  {
    title: "Robin's Birthday",
    description:
      "Loves:\nGoat Cheese, Peach, Spaghetti, Woody's Secret\nLikes:\nAll Fruit (except Peach),All Milk, Hardwood, Quartz, Woodcutter's Weekly",
    tag: Tag.Robin,
    gameDate: { isRecurring: true, day: 21, season: Season.FALL },
    type: Type.SystemBirthdays,
  },
  {
    title: "Sam's Birthday",
    description:
      'Loves:\nCactus Fruit, Maple Bar, Pizza, Tigerseye\nLikes:\nAll Eggs (except Void Egg),Joja Cola',
    tag: Tag.Sam,
    gameDate: { isRecurring: true, day: 17, season: Season.SUMMER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Sandy's Birthday",
    description:
      'Loves:\nCrocus, Daffodil, Mango Sticky Rice, Sweet Pea\nLikes:\nAll Fruit, Goat Milk, Large Goat Milk, Quartz, Wool',
    tag: Tag.Sandy,
    gameDate: { isRecurring: true, day: 15, season: Season.FALL },
    type: Type.SystemBirthdays,
  },
  {
    title: "Sebastian's Birthday",
    description:
      'Loves:\nFrog Egg, Frozen Tear, Obsidian, Pumpkin Soup, Sashimi, Void Egg\nLikes:\nCombat Quarterly, Flounder, Monster Compendium, Quartz',
    tag: Tag.Sebastian,
    gameDate: { isRecurring: true, day: 10, season: Season.WINTER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Shane's Birthday",
    description:
      'Loves:\nBeer, Hot Pepper, Pepper Poppers, Pizza\nLikes:\nAll Eggs (except Void Egg),All Fruit (except Hot Pepper)',
    tag: Tag.Shane,
    gameDate: { isRecurring: true, day: 20, season: Season.SPRING },
    type: Type.SystemBirthdays,
  },
  {
    title: "Vincent's Birthday",
    description:
      'Loves:\nCranberry Candy, Frog Egg, Ginger Ale, Grape, Pink Cake, Snail\nLikes:\nAll Milk, Coconut, Daffodil',
    tag: Tag.Vincent,
    gameDate: { isRecurring: true, day: 10, season: Season.SPRING },
    type: Type.SystemBirthdays,
  },
  {
    title: "Willy's Birthday",
    description:
      "Loves:\nCatfish, Diamond, Gold Bar, Iridium Bar, Jewels Of The Sea, Mead, Octopus, Pumpkin, Sea Cucumber, Sturgeon, The Art O' Crabbing\nLikes:\nBait And Bobber, Lingcod, Quartz, Seafoam Pudding, Tiger Trout",
    tag: Tag.Willy,
    gameDate: { isRecurring: true, day: 24, season: Season.SUMMER },
    type: Type.SystemBirthdays,
  },
  {
    title: "Wizard's Birthday",
    description:
      'Loves:\nBook of Mysteries, Purple Mushroom, Solar Essence, Super Cucumber, Void Essence\nLikes:\nAll Geode Minerals, All Trinkets, Iridium Bar, Quartz',
    tag: Tag.Wizard,
    gameDate: { isRecurring: true, day: 17, season: Season.WINTER },
    type: Type.SystemBirthdays,
  },
];
