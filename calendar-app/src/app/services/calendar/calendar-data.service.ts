import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Calendar } from '../../models/calendar.model';
import { GameEvent } from '../../models/game-event.model';
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
    description: string,
    includeBirthdays: boolean,
    includeFestivals: boolean,
    includeCrops: boolean,
    defaultEvents: GameEvent[],
  ): Observable<Calendar> {
    const publishedAt = new Date().toISOString();
    const variables = {
      name,
      description,
      publishedAt,
      systemConfig: { includeBirthdays, includeFestivals, includeCrops },
      gameEvents: defaultEvents.map((e) => e.id),
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
      .graphql(this.updateQuery(), { data: calendar })
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
    const gameEvents: GameEvent[] = data.attributes.gameEvents.data.map(
      (event) => ({
        id: event.id,
        title: event.attributes.title,
        description: event.attributes.description,
        tag: event.attributes.tag,
        publishedAt: event.attributes.publishedAt ?? '',
        type: event.attributes.type,
        gameDate: {
          ...EventDateUtils.getGameDateUnion(event.attributes.gameDate),
        },
      }),
    );

    const regexArray: string[] = [];
    if (data.attributes.systemConfig.includeBirthdays)
      regexArray.push('birthdays');
    if (data.attributes.systemConfig.includeFestivals)
      regexArray.push('festivals');
    if (data.attributes.systemConfig.includeCrops) regexArray.push('crops');
    const regexString = regexArray.join('|');

    const calendar: Calendar = {
      id: data.id,
      name: data.attributes.name,
      publishedAt: data.attributes.publishedAt?.toString() ?? '',
      description: data.attributes.description,
      systemConfig: data.attributes.systemConfig,
      gameEvents,
      filteredGameEvents: gameEvents.filter((event) =>
        new RegExp(regexString).test(event.type),
      ),
    };
    return calendar;
  }

  private updateQuery() {
    return `
    mutation updateCalendar($id: ID!, $data: CalendarInput!) {
      updateCalendar(id: $id, data: $data) {
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
      $systemConfig: ComponentCalendarSystemConfigInput
      $description: String
    ) {
      createCalendar(
        data: {
          name: $name
          publishedAt: $publishedAt
          gameEvents: $gameEvents
          systemConfig: $systemConfig
          description: $description
        }
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
        systemConfig {
          includeCrops
          includeBirthdays
          includeFestivals
        }
        description
        gameEvents(pagination: { limit: ${getAll} }) {
          data {
            id
            attributes {
              title
              description
              tag
              type
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
