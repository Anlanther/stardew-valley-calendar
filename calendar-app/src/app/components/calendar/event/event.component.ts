import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TAG_METADATA } from '../../../constants/tag-metadata.constant';
import { AppStore } from '../../../models/app-store.model';
import { GameEvent } from '../../../models/game-event.model';
import { EventDateUtils } from '../../../services/event-date.utils';
import { AppActions } from '../../../state/app.actions';
import { AppFeature } from '../../../state/app.state';

interface GameEventDisplay extends GameEvent {
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

  gameEvents: GameEventDisplay[] = [];
  isSelected = false;

  calendarSeasonEvents$: Observable<GameEvent[]>;
  subs = new Subscription();

  constructor() {
    this.calendarSeasonEvents$ = this.store.pipe(
      select(AppFeature.selectCalendarSeasonEvents),
    );
  }

  ngOnInit(): void {
    this.subs.add(
      this.calendarSeasonEvents$.subscribe((gameEvents) => {
        const filteredEvents = gameEvents
          .filter((event) => event.gameDate.day === this.day)
          .map((e) => ({ ...e, url: TAG_METADATA.get(e.tag)!.url }));

        this.gameEvents = [...filteredEvents];
      }),
    );
    this.subs.add(
      this.store
        .pipe(select(AppFeature.selectIsDateSelected))
        .subscribe((selectedOptions) => {
          const test =
            selectedOptions.navBarOpen && selectedOptions.day === this.day;
          this.isSelected = test;
        }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setActiveEvent() {
    this.store.dispatch(AppActions.updateActiveFormEvents(this.gameEvents));
    this.store.dispatch(AppActions.updateActiveDay(this.day));
    this.store.dispatch(AppActions.toggleNavBar(true));
  }
}
