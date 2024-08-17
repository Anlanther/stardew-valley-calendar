import { Injectable } from '@angular/core';
import { Calendar } from '../models/calendar.model';
import { GameDate } from '../models/game-date.model';
import { GameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { GameDateComponent } from './models/GameDateComponent';

@Injectable({
  providedIn: 'root',
})
export class EventDateUtils {
  static getEventsForDate(
    season: Season,
    year: number,
    calendar: Calendar,
  ): GameEvent[] {
    return calendar.gameEvents.filter((event) => {
      let normalCondition = false;
      const isCorrectSeason = event.gameDate.season === season;
      const isCorrectYear = event.gameDate.isRecurring
        ? true
        : event.gameDate.year === year;

      if (isCorrectSeason && isCorrectYear) {
        normalCondition = true;
      }

      return normalCondition;
    });
  }

  static getGameDateUnion(gameDate: GameDateComponent): GameDate {
    const gameDateUnion: GameDate = gameDate.isRecurring
      ? {
          id: gameDate.id,
          day: gameDate.day,
          isRecurring: gameDate.isRecurring,
          season: gameDate.season,
        }
      : {
          id: gameDate.id,
          day: gameDate.day,
          isRecurring: gameDate.isRecurring,
          season: gameDate.season,
          year: gameDate.year!,
        };

    return gameDateUnion;
  }
}
