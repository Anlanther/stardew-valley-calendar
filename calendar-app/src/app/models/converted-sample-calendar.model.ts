export interface ConvertedSampleCalendar {
  name: string;
  description: string;
  gameEvents: GameEvent[];
  systemConfig: SystemConfig;
}

interface GameEvent {
  id: string;
  title: string;
  description: string;
  tag: string;
  publishedAt?: string;
  type: string;
  gameDate: GameDate;
}

interface GameDate {
  id: string;
  day: number;
  isRecurring: boolean;
  season: string;
  year: number;
}

interface SystemConfig {
  includeCrops: boolean;
  includeBirthdays: boolean;
  includeFestivals: boolean;
}
