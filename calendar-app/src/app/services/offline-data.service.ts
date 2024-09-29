import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BIRTHDAY_EVENTS } from '../constants/birthday-events.constant';
import { CROPS_DEADLINES } from '../constants/crops-deadline.constant';
import { FESTIVAL_EVENTS } from '../constants/festival-events.constant';
import { Calendar } from '../models/calendar.model';
import { GameEvent, UnsavedGameEvent } from '../models/game-event.model';
import { Type } from '../models/type.model';
import { EventUtils } from './event.utils';

@Injectable({
  providedIn: 'root',
})
export class OfflineDataService {
  getAllCalendars(): Observable<Calendar[]> {
    return of([]);
  }

  getCalendar(
    id: string,
    offlineAvailableCalendars: Calendar[],
  ): Observable<Calendar> {
    const selectedCalendar: Calendar = offlineAvailableCalendars.find(
      (calendar) => calendar.id === id,
    )!;
    return of(selectedCalendar);
  }

  createCalendar(
    name: string,
    description: string,
    includeBirthdays: boolean,
    includeFestivals: boolean,
    includeCrops: boolean,
  ): Observable<Calendar> {
    const calendar: Calendar = {
      id: crypto.randomUUID(),
      name,
      description,
      systemConfig: { includeBirthdays, includeCrops, includeFestivals },
      gameEvents: [],
      filteredGameEvents: EventUtils.getFilteredSystemEvents(
        includeBirthdays,
        includeCrops,
        includeFestivals,
        [],
      ),
      publishedAt: '',
    };

    return of(calendar);
  }

  createGameEvent(
    gameEvent: UnsavedGameEvent,
    type: Type = Type.User,
  ): Observable<GameEvent> {
    const newGameEvent: GameEvent = {
      ...gameEvent,
      id: crypto.randomUUID(),
      gameDate: { ...gameEvent.gameDate, id: crypto.randomUUID() },
      type,
      publishedAt: '',
    };

    return of(newGameEvent);
  }

  createMultipleGameEvents(
    gameEvents: UnsavedGameEvent[],
  ): Observable<GameEvent[]> {
    if (gameEvents.length === 0) {
      return of([]);
    }

    const createdGameEvents: GameEvent[] = gameEvents.map((event) => ({
      ...event,
      id: crypto.randomUUID(),
      publishedAt: '',
      gameDate: { ...event.gameDate, id: crypto.randomUUID() },
    }));

    return of(createdGameEvents);
  }

  updateGameEvent(
    gameEvent: GameEvent,
    activeCalendar: Calendar,
  ): Observable<GameEvent> {
    const gameEventToUpdate: GameEvent = activeCalendar.gameEvents.find(
      (event) => event.id === gameEvent.id,
    )!;
    const updatedGameEvent: GameEvent = {
      ...gameEventToUpdate,
      title: gameEvent.title,
      description: gameEvent.description,
      tag: gameEvent.tag,
      gameDate: gameEvent.gameDate,
      type: gameEvent.type,
    };

    return of(updatedGameEvent);
  }

  updateCalendarDetails(
    calendar: Partial<Calendar>,
    offlineActiveCalendar: Calendar,
  ): Observable<Calendar> {
    const updatedCalendar: Calendar = {
      ...offlineActiveCalendar,
      ...calendar,
    };
    return of(updatedCalendar);
  }

  updateCalendarEvents(
    calendar: Partial<Calendar>,
    offlineActiveCalendar: Calendar,
  ): Observable<Calendar> {
    const calendarToUpdate: Calendar = {
      ...offlineActiveCalendar,
      gameEvents: calendar.gameEvents ?? [],
    };
    return of(calendarToUpdate);
  }

  deleteGameEvent(id: string): Observable<string> {
    return of(id);
  }

  getOrCreateEventDefaults(): Observable<GameEvent[]> {
    const systemEvents: GameEvent[] = [
      ...BIRTHDAY_EVENTS,
      ...FESTIVAL_EVENTS,
      ...CROPS_DEADLINES,
    ].map((event) => ({
      ...event,
      id: crypto.randomUUID(),
      publishedAt: '',
      gameDate: { ...event.gameDate, id: crypto.randomUUID() },
    }));

    return of(systemEvents);
  }

  deleteManyGameEvents(ids: string[]): Observable<string[]> {
    return of(ids);
  }

  deleteCalendar(id: string): Observable<string> {
    return of(id);
  }
}
