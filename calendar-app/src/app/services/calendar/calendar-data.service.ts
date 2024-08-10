import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Calendar } from '../../models/calendar.model';
import { DeepPartial } from '../../models/deep-partial.model';
import { DataService } from '../data.service';
import { EventDateUtils } from '../event-date.utils';
import { Calendar_Data, Calendar_NoRelations } from '../models/calendar';

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
    };

    return this.dataService.graphql(this.getCreateQuery(), variables).pipe(
      map((response) => {
        return response.createCalendar.data.map((calendar: Calendar_Data) => ({
          ...calendar.attributes,
          id: calendar.id,
        }));
      }),
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
      .graphql(this.getUpdateQuery(), calendar)
      .pipe(
        map((response) => this.convertToCalendar(response.updateCalendar.data)),
      );
  }

  delete(id: string): Observable<string> {
    return this.dataService
      .graphql(this.getDeleteQuery(), { id })
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

  private getUpdateQuery() {
    return `
    mutation updateCalendar($id: ID!, $gameEvents: [ID]) {
      updateCalendar(id: $id, data: { gameEvents: $gameEvents }) {
        ${this.getBaseDataQuery()}
      }
    }`;
  }

  private getOneQuery() {
    return `
    query getCalendar($id: ID) {
      calendar(id: $id) {
        ${this.getBaseDataQuery()}
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
    mutation createCalendar($name: String, $publishedAt: DateTime) {
      createCalendar(data: { name: $name, publishedAt: $publishedAt }) {
        ${this.getBaseDataQuery()}
      }
    }
`;
  }

  private getDeleteQuery() {
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

  private getBaseDataQuery() {
    return `
    data {
          id
          attributes {
            name
            gameEvents {
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
