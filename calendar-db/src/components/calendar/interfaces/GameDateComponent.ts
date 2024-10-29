// Interface automatically generated by schemas-to-ts

export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Fall = 'fall',
  Winter = 'winter',}

export interface GameDateComponent {
  season: Season;
  day: number;
  year?: number;
  isRecurring: boolean;
}
export interface GameDateComponent_Plain {
  season: Season;
  day: number;
  year?: number;
  isRecurring: boolean;
}

export interface GameDateComponent_NoRelations {
  season: Season;
  day: number;
  year?: number;
  isRecurring: boolean;
}
