import { Injectable } from '@angular/core';
import { CalendarEvent } from '../models/calendar-event.model';
import { Calendar } from '../models/calendar.model';
import { Season } from '../models/season.model';

@Injectable({
  providedIn: 'root',
})
export class EventDateUtils {
  getEventsForDate(
    day: number,
    season: Season,
    year: number,
    calendar: Calendar,
  ): CalendarEvent[] {
    return calendar.calendarEvents.filter((event) => {
      let normalCondition = false;
      const isCorrectSeason = event.gameDate.season === season;
      const isCorrectDay = event.gameDate.day === day;
      const isCorrectYear = event.gameDate.isRecurring
        ? true
        : event.gameDate.year === year;

      if (isCorrectDay && isCorrectSeason && isCorrectYear) {
        normalCondition = true;
      }

      return normalCondition;
    });
  }
}
