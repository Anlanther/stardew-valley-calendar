// Interface automatically generated by schemas-to-ts

export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Fall = 'fall',
  Winter = 'winter',}

export interface GameDate {
  season: Season;
  day: number;
  year?: number;
  isRecurring: boolean;
}
export interface GameDate_Plain {
  season: Season;
  day: number;
  year?: number;
  isRecurring: boolean;
}

export interface GameDate_NoRelations {
  season: Season;
  day: number;
  year?: number;
  isRecurring: boolean;
}

