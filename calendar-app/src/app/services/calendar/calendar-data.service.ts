import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BIRTHDAY_EVENTS } from '../../constants/birthday-events.constant';
import { CROPS_DEADLINES } from '../../constants/crops-deadline.constant';
import { Calendar } from '../../models/calendar.model';
import { DeepPartial } from '../../models/deep-partial.model';
import { GameDate } from '../../models/game-date.model';
import { DataService } from '../data.service';
import { GameDateComponent } from '../models/GameDateComponent';
import { Calendar_Data } from '../models/calendar';

@Injectable({
  providedIn: 'root',
})
export class CalendarDataService {
  private dataService = inject(DataService);
  create(name: string): Observable<Calendar> {
    const publishedAt = new Date().toISOString();
    const variables: DeepPartial<Calendar> = {
      name,
      publishedAt,
      calendarEvents: [...BIRTHDAY_EVENTS, ...CROPS_DEADLINES],
    };

    return this.dataService
      .graphql<Calendar>(this.getCreateQuery(), variables)
      .pipe(
        map((response) => {
          return response.createCalendar.data.map(
            (calendar: Calendar_Data) => ({
              ...calendar.attributes,
              id: calendar.id,
            }),
          );
        }),
      );
  }

  get(id: string): Observable<Calendar> {
    return this.dataService
      .graphql<Calendar>(this.getOneQuery(), { id })
      .pipe(map((response) => this.convertToCalendar(response.calendar.data)));
  }

  getAll(): Observable<Calendar[]> {
    const queryName = 'getAllCalendars';
    const settings = `(pagination: { limit: -1 })`;

    return this.dataService
      .graphql<Calendar[]>(this.getQuery(queryName, settings))
      .pipe(
        map((response) => {
          return response.calendars.data.map((calendar: Calendar_Data) => ({
            id: calendar.id,
            name: calendar.attributes.name,
          }));
        }),
      );
  }

  private convertToCalendar(data: Calendar_Data): Calendar {
    const getGameDateUnion = (gameDate: GameDateComponent) => {
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
    };

    const calendar: Calendar = {
      id: data.id,
      name: data.attributes.name,
      publishedAt: data.attributes.publishedAt?.toString() ?? '',
      calendarEvents: data.attributes.gameEvents.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        tag: event.tag,
        gameDate: {
          ...getGameDateUnion(event.gameDate),
        },
      })),
    };
    return calendar;
  }

  private getOneQuery() {
    return `
    query getCalendar($id: ID) {
      calendar(id: $id) {
        data {
          id
          attributes {
            name
            gameEvents {
              id
              title
              description
              tag
              gameDate {
                id
                season
                day
                year
                isRecurring
              }
            }
          }
        }
      }
    }
`;
  }

  private getQuery(queryName: string, settings?: string) {
    return `
    query ${queryName} {
      calendars ${settings ?? ''} {
        data {
          id
          attributes {
            name
          }
        }
      }
    }
`;
  }

  private getCreateQuery() {
    return `
    mutation createCalendar(
      $name: String
      $calendarEvents: [ComponentCalendarGameEventInput]
      $publishedAt: DateTime
    ) {
      createCalendar(
        data: { name: $name, gameEvents: $calendarEvents, publishedAt: $publishedAt }
      ) {
        data {
          id
          attributes {
            name
            gameEvents {
              id
              title
              description
              gameDate {
                id
                season
                day
                year
                isRecurring
              }
              tag
            }
          }
        }
      }
    }`;
  }
}
