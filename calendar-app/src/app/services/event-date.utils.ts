import { Injectable } from '@angular/core';
import { CalendarEvent } from '../models/calendar-event.model';
import { Calendar } from '../models/calendar.model';
import { Season } from '../models/season.model';

@Injectable({
  providedIn: 'root',
})
export class EventDateUtils {
  static getEventsForDate(
    season: Season,
    year: number,
    calendar: Calendar,
  ): CalendarEvent[] {
    return calendar.calendarEvents.filter((event) => {
      let normalCondition = false;
      const isCorrectSeason = event.gameDate.season === season;
      const isCorrectYear = event.gameDate.isRecurring
        ? true
        : event.gameDate.year === year;

      if (isCorrectSeason && isCorrectYear) {
        normalCondition = true;
      }

      console.log('static', isCorrectSeason, isCorrectYear, normalCondition);
      return normalCondition;
    });
  }
}
