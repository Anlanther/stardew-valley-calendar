import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { BIRTHDAY_EVENTS } from '../../constants/birthday-events.constant';
import { CROPS_DEADLINES } from '../../constants/crops-deadline.constant';
import { FESTIVAL_EVENTS } from '../../constants/festival-events.constant';
import { DeepPartial } from '../../models/deep-partial.model';
import { GameEvent, UnsavedGameEvent } from '../../models/game-event.model';
import { DataService } from '../data.service';
import { EventDateUtils } from '../event-date.utils';
import { GameEvent_Data, GameEvent_Plain, Type } from '../models/game-event';

@Injectable({
  providedIn: 'root',
})
export class GameEventDataService {
  private dataService = inject(DataService);

  getOrCreateDefaults(): Observable<GameEvent[]> {
    return this.getSystem().pipe(
      switchMap((systemEvents) => {
        if (systemEvents.length === 0) {
          const createdSystemEvents = forkJoin(
            [...BIRTHDAY_EVENTS, ...FESTIVAL_EVENTS, ...CROPS_DEADLINES].map(
              (event) => this.create(event, event.type),
            ),
          ).pipe(map((createdEvent) => createdEvent));
          return createdSystemEvents;
        }
        return of(systemEvents);
      }),
    );
  }

  create(
    gameEvent: UnsavedGameEvent,
    type: Type = Type.User,
  ): Observable<GameEvent> {
    const publishedAt = new Date().toISOString();
    const variables: DeepPartial<GameEvent_Plain> = {
      ...gameEvent,
      publishedAt,
      type,
    };

    return this.dataService.graphql(this.createQuery(), variables).pipe(
      map((response) => {
        return {
          ...response.createGameEvent.data.attributes,
          id: response.createGameEvent.data.id,
        };
      }),
    );
  }

  update(gameEvent: GameEvent): Observable<GameEvent> {
    const variables = {
      id: gameEvent.id,
      gameEvent: {
        title: gameEvent.title,
        description: gameEvent.description,
        tag: gameEvent.tag,
        gameDate: gameEvent.gameDate,
        type: gameEvent.type,
      },
    };

    return this.dataService
      .graphql(this.updateQuery(), variables)
      .pipe(
        map((response) =>
          this.convertTogameEvent(response.updateGameEvent.data),
        ),
      );
  }

  deleteMany(ids: string[]): Observable<string[]> {
    if (ids.length === 0) {
      return of([]);
    }
    return forkJoin(ids.map((id) => this.delete(id))).pipe(
      map((deletedIds) => deletedIds),
    );
  }

  delete(id: string): Observable<string> {
    const variables: DeepPartial<GameEvent> = { id };

    return this.dataService
      .graphql(this.deleteQuery(), variables)
      .pipe(map((response) => response.deleteGameEvent.data.id));
  }

  getSystem(): Observable<GameEvent[]> {
    return this.dataService
      .graphql(this.getSystemQuery())
      .pipe(
        map((response) =>
          response.gameEvents.data.map((event: GameEvent_Data) =>
            this.convertTogameEvent(event),
          ),
        ),
      );
  }

  convertTogameEvent(data: GameEvent_Data): GameEvent {
    const gameEvent: GameEvent = {
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

    return gameEvent;
  }

  private getSystemQuery() {
    const getAll = -1;
    return `
    query getGameSystemEvents($type: String) {
      gameEvents(
        filters: { type: { contains: $type } }
        pagination: { limit: ${getAll} }
      ) {
        ${this.baseDataQuery()}
      }
    }
    `;
  }

  private updateQuery() {
    return `
    mutation updateGameEvent($id: ID!, $gameEvent: GameEventInput!) {
      updateGameEvent(id: $id, data: $gameEvent) {
        ${this.baseDataQuery()}
      }
    }
`;
  }

  private createQuery() {
    return ` 
    mutation createGameEvent(
      $title: String
      $tag: ENUM_GAMEEVENT_TAG
      $description: String
      $gameDate: ComponentCalendarGameDateInput
      $publishedAt: DateTime
      $type: ENUM_GAMEEVENT_TYPE
    ) {
      createGameEvent(
        data: {
          title: $title
          publishedAt: $publishedAt
          gameDate: $gameDate
          description: $description
          tag: $tag
          type: $type
        }
      ) {
        ${this.baseDataQuery()}
      }
    }
`;
  }

  private deleteQuery() {
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

  private baseDataQuery() {
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
