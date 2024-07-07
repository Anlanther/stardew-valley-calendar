import { Component, Input, OnInit, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { ICON_METADATA } from '../../constants/icon-metadata.constant';
import { AppStore } from '../../models/app-store.model';
import { CalendarEvent } from '../../models/calendar-event.model';
import { Calendar } from '../../models/calendar.model';
import { Season } from '../../models/season.model';
import { EventDateUtils } from '../../services/event-date.utils';
import { AppActions } from '../../state/app.actions';

interface CalendarEventDisplay extends CalendarEvent {
  url: string;
}

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent implements OnInit {
  @Input() day!: number;
  @Input() year!: number;
  @Input() season!: Season;
  @Input() calendar!: Calendar;

  eventDateUtils = inject(EventDateUtils);
  store = inject(Store<AppStore>);

  gameEvents: CalendarEventDisplay[] = [];

  ngOnInit(): void {
    this.gameEvents = [
      ...this.eventDateUtils
        .getEventsForDate(this.day, this.season, this.year, this.calendar)
        .map((event) => ({ ...event, url: ICON_METADATA.get(event.tag)!.url })),
    ];
  }

  setActiveEvent() {
    this.store.dispatch(AppActions.updateActiveEvents(this.gameEvents));
  }
}
