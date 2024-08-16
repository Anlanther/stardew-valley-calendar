import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CalendarEvent } from '../../models/calendar-event.model';
import { Calendar } from '../../models/calendar.model';
import { DataService } from '../data.service';
import { EventDateUtils } from '../event-date.utils';
import { Calendar_Data, Calendar_NoRelations } from '../models/calendar';

@Injectable({
  providedIn: 'root',
})
export class CalendarDataService {
  private dataService = inject(DataService);

  create(
    name: string,
    includeBirthdays: boolean,
    includeFestivals: boolean,
    includeCrops: boolean,
    defaultEvents: CalendarEvent[],
  ): Observable<Calendar> {
    const regexArray = [];
    if (includeBirthdays) regexArray.push('birthdays');
    if (includeFestivals) regexArray.push('festivals');
    if (includeCrops) regexArray.push('crops');
    const regexString = regexArray.join('|');

    const gameEventIds: string[] = defaultEvents
      .filter((event) => new RegExp(regexString).test(event.type))
      .map((event) => event.id);

    const publishedAt = new Date().toISOString();
    const variables = {
      name,
      publishedAt,
      gameEvents: gameEventIds,
    };

    return this.dataService
      .graphql(this.createQuery(), variables)
      .pipe(
        map((response) => this.convertToCalendar(response.createCalendar.data)),
      );
  }

  get(id: string): Observable<Calendar> {
    return this.dataService
      .graphql(this.getOneQuery(), { id })
      .pipe(map((response) => this.convertToCalendar(response.calendar.data)));
  }

  getAll(): Observable<Calendar[]> {
    const queryName = 'getAllCalendars';
    const settings = `(pagination: { limit: -1 })`;

    return this.dataService.graphql(this.getQuery(queryName, settings)).pipe(
      map((response) => {
        return response.calendars.data.map((calendar: Calendar_Data) => ({
          id: calendar.id,
          name: calendar.attributes.name,
        }));
      }),
    );
  }

  update(calendar: Partial<Calendar_NoRelations>): Observable<Calendar> {
    return this.dataService
      .graphql(this.updateQuery(), calendar)
      .pipe(
        map((response) => this.convertToCalendar(response.updateCalendar.data)),
      );
  }

  delete(id: string): Observable<string> {
    return this.dataService
      .graphql(this.deleteQuery(), { id })
      .pipe(map((response) => response.deleteCalendar.data.id));
  }

  convertToCalendar(data: Calendar_Data): Calendar {
    const calendar: Calendar = {
      id: data.id,
      name: data.attributes.name,
      publishedAt: data.attributes.publishedAt?.toString() ?? '',
      calendarEvents: data.attributes.gameEvents.data.map((event) => ({
        id: event.id,
        title: event.attributes.title,
        description: event.attributes.description,
        tag: event.attributes.tag,
        publishedAt: event.attributes.publishedAt ?? '',
        type: event.attributes.type,
        gameDate: {
          ...EventDateUtils.getGameDateUnion(event.attributes.gameDate),
        },
      })),
    };
    return calendar;
  }

  private updateQuery() {
    return `
    mutation updateCalendar($id: ID!, $gameEvents: [ID]) {
      updateCalendar(id: $id, data: { gameEvents: $gameEvents }) {
        ${this.baseDataQuery()}
      }
    }`;
  }

  private getOneQuery() {
    return `
    query getCalendar($id: ID) {
      calendar(id: $id) {
        ${this.baseDataQuery()}
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

  private createQuery() {
    return ` 
    mutation createCalendar(
      $name: String
      $publishedAt: DateTime
      $gameEvents: [ID]
    ) {
      createCalendar(
        data: { name: $name, publishedAt: $publishedAt, gameEvents: $gameEvents }
      ) {
        ${this.baseDataQuery()}
      }
    }
`;
  }

  private deleteQuery() {
    return `
    mutation deleteCalendar($id: ID!) {
      deleteCalendar(id: $id) {
        data {
          id
        }
      }
    }
    `;
  }

  private baseDataQuery() {
    const getAll = -1;
    return `
    data {
      id
      attributes {
        name
        gameEvents(pagination: { limit: ${getAll} }) {
          data {
            id
            attributes {
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
}
