import { Injectable, inject } from '@angular/core';
import { Observable, concatMap, forkJoin, map, of, switchMap } from 'rxjs';
import { BIRTHDAY_EVENTS } from '../../constants/birthday-events.constant';
import { CROPS_DEADLINES } from '../../constants/crops-deadline.constant';
import { FESTIVAL_EVENTS } from '../../constants/festival-events.constant';
import { DeepPartial } from '../../models/deep-partial.model';
import { GameEvent, UnsavedGameEvent } from '../../models/game-event.model';
import { CalendarUtils } from '../calendar.utils';
import { DataService } from '../data.service';
import { GameEvent_Data, GameEvent_Plain, Type } from '../models/game-event';
import { GameEventArray } from '../models/game-event/game-event-array.model';
import { GameEventCreate } from '../models/game-event/game-event-create.model';
import { GameEventDelete } from '../models/game-event/game-event-delete.model';
import { GameEventUpdate } from '../models/game-event/game-event-update.model';

@Injectable({
  providedIn: 'root',
})
export class GameEventDataService {
  dataService = inject(DataService);

  getOrCreateDefaults(): Observable<GameEvent[]> {
    return this.getSystem().pipe(
      switchMap((systemEvents) => {
        if (systemEvents.length === 0) {
          const createdSystemEvents = forkJoin(
            [...BIRTHDAY_EVENTS, ...FESTIVAL_EVENTS, ...CROPS_DEADLINES].map(
              (event) => this.create(event, event.type),
            ),
          );
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

    return this.dataService
      .graphql<GameEventCreate>(this.createQuery(), variables)
      .pipe(
        map((response) => {
          return {
            ...response.createGameEvent.data.attributes,
            gameDate: CalendarUtils.getGameDateUnion(
              response.createGameEvent.data.attributes.gameDate,
            ),
            publishedAt:
              response.createGameEvent.data.attributes.publishedAt ?? '',
            id: response.createGameEvent.data.id,
          };
        }),
      );
  }

  createMultiple(gameEvents: UnsavedGameEvent[]): Observable<GameEvent[]> {
    if (gameEvents.length === 0) {
      return of([]);
    }
    return forkJoin(gameEvents.map((gameEvent) => this.create(gameEvent)));
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
      .graphql<GameEventUpdate>(this.updateQuery(), variables)
      .pipe(
        map((response) =>
          this.convertToGameEvent(response.updateGameEvent.data),
        ),
      );
  }

  deleteMany(ids: string[]): Observable<string[]> {
    if (ids.length === 0) {
      return of([]);
    }
    return forkJoin(ids.map((id) => this.delete(id)));
  }

  delete(id: string): Observable<string> {
    const variables: DeepPartial<GameEvent> = { id };

    return this.dataService
      .graphql<GameEventDelete>(this.deleteQuery(), variables)
      .pipe(map((response) => response.deleteGameEvent.data.id));
  }

  getSystem(): Observable<GameEvent[]> {
    return this.dataService
      .graphql<GameEventArray>(this.getSystemQuery(), { type: 'system' })
      .pipe(
        map((response) =>
          response.gameEvents.data.map((event: GameEvent_Data) =>
            this.convertToGameEvent(event),
          ),
        ),
      );
  }

  convertToGameEvent(data: GameEvent_Data): GameEvent {
    const gameEvent: GameEvent = {
      id: data.id,
      title: data.attributes.title,
      description: data.attributes.description,
      tag: data.attributes.tag,
      gameDate: {
        ...CalendarUtils.getGameDateUnion(data.attributes.gameDate),
      },
      publishedAt: data.attributes.publishedAt ?? '',
      type: data.attributes.type,
    };

    return gameEvent;
  }

  updateSystem() {
    return this.getSystem().pipe(
      map((savedEvents) => {
        const updatedEvents = savedEvents.reduce<GameEvent[]>((prev, curr) => {
          const unsavedEvent = [
            ...BIRTHDAY_EVENTS,
            ...FESTIVAL_EVENTS,
            ...CROPS_DEADLINES,
          ].find((event) => new RegExp(`${event.title}$`).test(curr.title));
          if (unsavedEvent) {
            prev.push({
              ...curr,
              ...unsavedEvent,
              gameDate: { ...curr.gameDate, ...unsavedEvent.gameDate },
            });
          }
          return prev;
        }, []);
        return { savedEvents, updatedEvents };
      }),
      switchMap(({ savedEvents, updatedEvents }) =>
        this.updateMany(updatedEvents).pipe(
          concatMap(() => this.deleteSystemEvents(savedEvents)),
          concatMap(() => this.createSystemEvents(savedEvents)),
        ),
      ),
    );
  }

  updateMany(gameEvents: GameEvent[]) {
    return forkJoin(gameEvents.map((event) => this.update(event)));
  }

  deleteSystemEvents(gameEvents: GameEvent[]) {
    const eventsDeleted = gameEvents.filter(
      (event) =>
        ![...BIRTHDAY_EVENTS, ...FESTIVAL_EVENTS, ...CROPS_DEADLINES].some(
          (unsavedEvent) =>
            new RegExp(`${unsavedEvent.title}$`).test(event.title),
        ),
    );

    if (eventsDeleted.length === 0) {
      return of([]);
    }
    return forkJoin(eventsDeleted.map((event) => this.delete(event.id)));
  }

  createSystemEvents(gameEvents: GameEvent[]) {
    const eventsCreated = [
      ...BIRTHDAY_EVENTS,
      ...FESTIVAL_EVENTS,
      ...CROPS_DEADLINES,
    ].filter(
      (event) =>
        !gameEvents.some((savedEvent) =>
          new RegExp(`${savedEvent.title}$`).test(event.title),
        ),
    );

    if (eventsCreated.length === 0) {
      return of([]);
    }

    return forkJoin(eventsCreated.map((event) => this.create(event)));
  }

  getSystemQuery() {
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

  updateQuery() {
    return `
    mutation updateGameEvent($id: ID!, $gameEvent: GameEventInput!) {
      updateGameEvent(id: $id, data: $gameEvent) {
        ${this.baseDataQuery()}
      }
    }
`;
  }

  createQuery() {
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

  deleteQuery() {
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

  baseDataQuery() {
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
