import { Injectable } from '@angular/core';
import { Calendar } from '../models/calendar.model';
import { GameDate } from '../models/game-date.model';
import { GameEvent } from '../models/game-event.model';
import { Season } from '../models/season.model';
import { GameDateComponent } from './models/GameDateComponent';

@Injectable({
  providedIn: 'root',
})
export class CalendarUtils {
  static getEventsForDate(
    season: Season,
    year: number,
    calendar: Calendar,
    day?: number,
  ): GameEvent[] {
    return calendar.filteredGameEvents.filter((event) => {
      let normalCondition = false;
      const isCorrectSeason = event.gameDate.season === season;
      const isCorrectYear = event.gameDate.isRecurring
        ? true
        : event.gameDate.year === year;
      const isCorrectDay = day === undefined || event.gameDate.day === day;

      if (isCorrectSeason && isCorrectYear && isCorrectDay) {
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

  static getFilteredSystemEvents(
    includeBirthdays: boolean,
    includeCrops: boolean,
    includeFestivals: boolean,
    gameEvents: GameEvent[],
  ) {
    const regexArray: string[] = [];
    if (includeBirthdays) regexArray.push('birthdays');
    if (includeFestivals) regexArray.push('festivals');
    if (includeCrops) regexArray.push('crops');
    const regexString = regexArray.join('|');

    const filteredGameEvents = gameEvents.filter((event) => {
      if (event.type.includes('user')) return true;
      return regexString === ''
        ? false
        : new RegExp(regexString).test(event.type);
    });

    return filteredGameEvents;
  }

  static getLoadedCalendarName(name: string, availableCalendars: Calendar[]) {
    const duplicates = availableCalendars.filter((calendar) => {
      const originalCopy = new RegExp(`^${name}$`, 'g').test(calendar.name);
      const incrementCopy = new RegExp(`^${name}\\[`, 'g').test(calendar.name);
      return originalCopy || incrementCopy;
    });
    const isUniqueName = duplicates.length === 0;
    const hasSingleDuplicate = duplicates.length === 1;

    if (isUniqueName) {
      return name;
    }
    if (hasSingleDuplicate) {
      return `${name}[1]`;
    }

    const nonOriginalDuplicates = duplicates.filter((d) => /\d/.test(d.name));
    const duplicateIndicator = /\[(\d+)\]/;
    const orderedDuplicateNumbers = nonOriginalDuplicates
      .map((d) => +d.name.match(duplicateIndicator)![1])
      .sort((a, b) => b - a);
    const newName = `${name}[${orderedDuplicateNumbers[0] + 1}]`;
    return newName;
  }
}
