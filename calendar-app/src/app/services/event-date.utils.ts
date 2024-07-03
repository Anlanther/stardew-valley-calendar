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
    calendar: Calendar
  ): CalendarEvent[] {
    return calendar.calendarEvents.filter((event) => {
      let normalCondition = false;
      let dueCondition = false;
      if (event.dueDate) {
        const isCorrectSeason = event.dueDate.season === season;
        const isCorrectDay = event.dueDate.day === day;
        const isCorrectYear = event.dueDate.isRecurring
          ? true
          : event.dueDate.year === year;

        if (isCorrectSeason && isCorrectDay && isCorrectYear) {
          dueCondition = true;
        }
      }
      const isCorrectSeason = event.gameDate.season === season;
      const isCorrectDay = event.gameDate.day === day;
      const isCorrectYear = event.gameDate.isRecurring
        ? true
        : event.gameDate.year === year;

      if (isCorrectDay && isCorrectSeason && isCorrectYear) {
        normalCondition = true;
      }

      return normalCondition || dueCondition;
    });
  }
}
