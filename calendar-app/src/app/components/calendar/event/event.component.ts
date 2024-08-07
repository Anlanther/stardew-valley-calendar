import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ICON_METADATA } from '../../../constants/icon-metadata.constant';
import { AppStore } from '../../../models/app-store.model';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { EventDateUtils } from '../../../services/event-date.utils';
import { AppActions } from '../../../state/app.actions';
import { AppFeature } from '../../../state/app.state';

interface CalendarEventDisplay extends CalendarEvent {
  url: string;
}

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent implements OnInit, OnDestroy {
  @Input() day!: number;

  eventDateUtils = inject(EventDateUtils);
  store = inject(Store<AppStore>);

  gameEvents: CalendarEventDisplay[] = [];

  calendarSeasonEvents$: Observable<CalendarEvent[]>;
  subs = new Subscription();

  constructor() {
    this.calendarSeasonEvents$ = this.store.pipe(
      select(AppFeature.selectCalendarSeasonEvents),
    );
  }

  ngOnInit(): void {
    this.subs.add(
      this.calendarSeasonEvents$.subscribe((calendarEvents) => {
        const filteredEvents = calendarEvents
          .filter((event) => event.gameDate.day === this.day)
          .map((e) => ({ ...e, url: ICON_METADATA.get(e.tag)!.url }));

        this.gameEvents = [...filteredEvents];
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setActiveEvent() {
    this.store.dispatch(AppActions.updateActiveFormEvents(this.gameEvents));
    this.store.dispatch(AppActions.updateActiveDay(this.day));
  }
}
