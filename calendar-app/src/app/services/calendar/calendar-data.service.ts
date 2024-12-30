import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Calendar } from '../../models/calendar.model';
import { GameEvent } from '../../models/game-event.model';
import { CalendarUtils } from '../calendar.utils';
import { DataService } from '../data.service';
import { Calendar_Data } from '../models/calendar';
import { CalendarArray } from '../models/calendar/calendar-array.model';
import { CalendarCreate } from '../models/calendar/calendar-create.model';
import { CalendarDelete } from '../models/calendar/calendar-delete.model';
import { CalendarSingle } from '../models/calendar/calendar-single.model';
import { CalendarUpdate } from '../models/calendar/calendar-update.model';

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
  ): Observable<Calendar> {
    const publishedAt = new Date().toISOString();
    const variables = {
      name,
      description,
      publishedAt,
      systemConfig: { includeBirthdays, includeFestivals, includeCrops },
    };

    return this.dataService
      .graphql<CalendarCreate>(this.createQuery(), variables)
      .pipe(
        map((response) => this.convertToCalendar(response.createCalendar.data)),
      );
  }

  get(id: string): Observable<Calendar> {
    return this.dataService
      .graphql<CalendarSingle>(this.getOneQuery(), { id })
      .pipe(map((response) => this.convertToCalendar(response.calendar.data)));
  }

  getAll(): Observable<Calendar[]> {
    const queryName = 'getAllCalendars';
    const settings = `(pagination: { limit: -1 })`;

    return this.dataService
      .graphql<CalendarArray>(this.getQuery(queryName, settings))
      .pipe(
        map((response) => {
          return response.calendars.data.map((calendar: Calendar_Data) =>
            this.convertToCalendar(calendar),
          );
        }),
      );
  }

  updateDetails(calendar: Partial<Calendar>): Observable<Calendar> {
    const variables = {
      id: calendar.id,
      name: calendar.name,
      description: calendar.description,
      systemConfig: calendar.systemConfig,
    };
    return this.dataService
      .graphql<CalendarUpdate>(this.updateDetailsQuery(), variables)
      .pipe(
        map((response) => this.convertToCalendar(response.updateCalendar.data)),
      );
  }

  updateEvents(calendar: Partial<Calendar>): Observable<Calendar> {
    const variables = {
      id: calendar.id,
      gameEvents: calendar.gameEvents?.map((event) => event.id),
    };
    return this.dataService
      .graphql<CalendarUpdate>(this.updateEventsQuery(), variables)
      .pipe(
        map((response) => this.convertToCalendar(response.updateCalendar.data)),
      );
  }

  delete(id: string): Observable<string> {
    return this.dataService
      .graphql<CalendarDelete>(this.deleteQuery(), { id })
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
          ...CalendarUtils.getGameDateUnion(event.attributes.gameDate),
        },
      }),
    );
    const filteredGameEvents = CalendarUtils.getFilteredSystemEvents(
      data.attributes.systemConfig.includeBirthdays,
      data.attributes.systemConfig.includeCrops,
      data.attributes.systemConfig.includeFestivals,
      gameEvents,
    );
    const calendar: Calendar = {
      id: data.id,
      name: data.attributes.name,
      publishedAt: data.attributes.publishedAt?.toString() ?? '',
      description: data.attributes.description,
      systemConfig: data.attributes.systemConfig,
      gameEvents,
      filteredGameEvents,
    };
    return calendar;
  }

  private updateDetailsQuery() {
    return `
      mutation updateCalendarDetails(
        $id: ID!
        $name: String
        $description: String
        $systemConfig: ComponentCalendarSystemConfigInput
      ) {
        updateCalendar(
          id: $id
          data: {
            name: $name
            description: $description
            systemConfig: $systemConfig
          }
        ) {
        ${this.baseDataQuery()}
      }
    }`;
  }

  private updateEventsQuery() {
    return `
    mutation updateCalendarEvents($id: ID!, $gameEvents: [ID]) {
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
