import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CalendarEvent,
  UnsavedCalendarEvent,
} from '../../models/calendar-event.model';
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

    return this.dataService.graphql(this.getCreateQuery(), variables).pipe(
      map((response) => {
        return response.createCalendar.data.map((calendar: Calendar_Data) => ({
          ...calendar.attributes,
          id: calendar.id,
        }));
      }),
    );
  }

  create(calendarEvent: UnsavedCalendarEvent): Observable<CalendarEvent> {
    const publishedAt = new Date().toISOString();
    const variables: DeepPartial<GameEvent_Plain> = {
      ...calendarEvent,
      publishedAt,
    };

    return this.dataService.graphql(this.getCreateQuery(), variables).pipe(
      map((response) => {
        return {
          ...response.createGameEvent.data.attributes,
          id: response.createGameEvent.data.id,
        };
      }),
    );
  }

  update(calendarEvent: CalendarEvent): Observable<CalendarEvent> {
    const variables = {
      id: calendarEvent.id,
      gameEvent: {
        title: calendarEvent.title,
        description: calendarEvent.description,
        tag: calendarEvent.tag,
        gameDate: calendarEvent.gameDate,
      },
    };

    return this.dataService
      .graphql(this.getUpdateQuery(), variables)
      .pipe(
        map((response) =>
          this.convertToCalendarEvent(response.updateGameEvent.data),
        ),
      );
  }

  delete(id: string): Observable<string> {
    const variables: DeepPartial<CalendarEvent> = { id };

    return this.dataService
      .graphql(this.getDeleteQuery(), variables)
      .pipe(map((response) => response.deleteGameEvent.data.id));
  }

  convertToCalendarEvent(data: GameEvent_Data): CalendarEvent {
    const calendarEvent: CalendarEvent = {
      id: data.id,
      title: data.attributes.title,
      description: data.attributes.description,
      tag: data.attributes.tag,
      gameDate: {
        ...EventDateUtils.getGameDateUnion(data.attributes.gameDate),
      },
      publishedAt: data.attributes.publishedAt ?? '',
      type: data.attributes.type,
    };

    return calendarEvent;
  }

  private getUpdateQuery() {
    return `
    mutation updateGameEvent($id: ID!, $gameEvent: GameEventInput!) {
      updateGameEvent(id: $id, data: $gameEvent) {
        ${this.getObject()}
      }
    }
`;
  }

  private getCreateQuery() {
    return ` 
    mutation createGameEvent(
      $title: String
      $tag: ENUM_GAMEEVENT_TAG
      $description: String
      $gameDate: ComponentCalendarGameDateInput
      $publishedAt: DateTime
    ) {
      createGameEvent(
        data: {
          title: $title
          publishedAt: $publishedAt
          gameDate: $gameDate
          description: $description
          tag: $tag
        }
      ) {
        ${this.getObject()}
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
        }
      }
    }
`;
  }

  private getObject() {
    return `
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
      }`;
  }
}
