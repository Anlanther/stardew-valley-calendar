import { Season } from './season.model';

export type GameDate = GameDateBase & (GameDateRecurring | GameDateSingle);

interface GameDateRecurring {
  year: number;
  isRecurring: true;
}

interface GameDateSingle {
  isRecurring: false;
}

interface GameDateBase {
  season: Season;
  day: number;
}
