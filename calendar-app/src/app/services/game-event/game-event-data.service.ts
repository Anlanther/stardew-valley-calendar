import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CalendarEvent } from '../../models/calendar-event.model';
import { DeepPartial } from '../../models/deep-partial.model';
import { DataService } from '../data.service';
import { EventDateUtils } from '../event-date.utils';
import { Calendar_Data } from '../models/calendar';
import { GameEvent_Data, GameEvent_Plain } from '../models/game-event';

@Injectable({
  providedIn: 'root',
})
export class GameEventDataService {
  private dataService = inject(DataService);

  createDefaults(): Observable<CalendarEvent> {
    const publishedAt = new Date().toISOString();
    const variables: DeepPartial<CalendarEvent> = {
      publishedAt,
    };

    return this.dataService
      .graphql<CalendarEvent>(this.getCreateQuery(), variables)
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

  create(calendarEvent: CalendarEvent): Observable<CalendarEvent> {
    const publishedAt = new Date().toISOString();
    const variables: DeepPartial<GameEvent_Plain> = {
      ...calendarEvent,
      publishedAt,
    };

    return this.dataService
      .graphql<CalendarEvent>(this.getCreateQuery(), variables)
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

  update(calendarEvent: CalendarEvent): Observable<CalendarEvent> {
    const variables: DeepPartial<CalendarEvent> = {};

    return this.dataService
      .graphql<CalendarEvent>(this.getUpdateQuery(), variables)
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

  delete(id: string): Observable<CalendarEvent> {
    const variables: DeepPartial<CalendarEvent> = {};

    return this.dataService
      .graphql<CalendarEvent>(this.getDeleteQuery(), variables)
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

  private convertToCalendarEvent(data: GameEvent_Data): CalendarEvent {
    const calendarEvent: CalendarEvent = {
      id: data.id,
      title: data.attributes.title,
      description: data.attributes.description,
      tag: data.attributes.tag,
      gameDate: {
        ...EventDateUtils.getGameDateUnion(data.attributes.gameDate),
      },
      publishedAt: data.attributes.publishedAt ?? '',
    };

    return calendarEvent;
  }

  private getUpdateQuery() {
    return `
    mutation updateGameEvent($id: ID!, $gameEvent: GameEventInput!) {
      updateGameEvent(id: $id, data: $gameEvent) {
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
`;
  }

  private getCreateQuery() {
    return ` 
    mutation createGameEvent(
      $title: String
      $gameDate: ComponentCalendarGameDateInput
      $publishedAt: DateTime
    ) {
      createGameEvent(
        data: { title: $title, publishedAt: $publishedAt, gameDate: $gameDate }
      ) {
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
`;
  }

  private getDeleteQuery() {
    return `
    mutation deleteGameEvent($id: ID!) {
      deleteGameEvent(id: $id) {
        data {
          id
          attributes {
            title
          }
        }
      }
    }
`;
  }
}
