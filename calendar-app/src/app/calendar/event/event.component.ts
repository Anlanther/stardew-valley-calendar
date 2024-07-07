import { Component, Input, OnInit, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ICON_METADATA } from '../../constants/icon-metadata.constant';
import { CalendarEvent } from '../../models/calendar-event.model';
import { Calendar } from '../../models/calendar.model';
import { Season } from '../../models/season.model';
import { EventDateUtils } from '../../services/event-date.utils';

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

  gameEvents: CalendarEventDisplay[] = [];

  ngOnInit(): void {
    this.gameEvents = [
      ...this.eventDateUtils
        .getEventsForDate(this.day, this.season, this.year, this.calendar)
        .map((event) => ({ ...event, url: ICON_METADATA.get(event.tag)!.url })),
    ];
  }
}
