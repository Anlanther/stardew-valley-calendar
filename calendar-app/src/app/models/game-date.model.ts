import { Season } from './season.model';

export type GameDate = GameDateBase & (GameDateRecurring | GameDateSingle);

interface GameDateRecurring {
  isRecurring: true;
}

interface GameDateSingle {
  isRecurring: false;
  year: number;
}

interface GameDateBase {
  id: string;
  season: Season;
  day: number;
}
