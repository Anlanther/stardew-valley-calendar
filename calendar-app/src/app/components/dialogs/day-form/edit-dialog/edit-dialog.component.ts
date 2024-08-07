import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CalendarEvent,
  UnsavedCalendarEvent,
} from '../../../../models/calendar-event.model';
import { UnsavedGameDate } from '../../../../models/game-date.model';
import { Season } from '../../../../models/season.model';
import { Tag } from '../../../../models/tag.model';

@Component({
  selector: 'app-edit-event-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditEventDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<EditEventDialogComponent>);
  data: { calendarEvent: CalendarEvent; activeYear: number } =
    inject(MAT_DIALOG_DATA);

  eventForm!: FormGroup;
  tags = Object.values(Tag);

  constructor() {
    this.eventForm = this.fb.group({
      title: [this.data.calendarEvent.title, [Validators.required]],
      description: [this.data.calendarEvent.description],
      tag: [this.data.calendarEvent.tag, [Validators.required]],
      isRecurring: [this.data.calendarEvent.gameDate.isRecurring],
    });
  }

  editEvent() {
    const isRecurring: boolean = this.eventForm.get('isRecurring')?.value;

    const gameDate: UnsavedGameDate = isRecurring
      ? {
          day: this.data.calendarEvent.gameDate.day,
          isRecurring: true,
          season: this.eventForm.get('season')?.value ?? Season.SPRING,
        }
      : {
          day: this.data.calendarEvent.gameDate.day,
          isRecurring: false,
          season: this.eventForm.get('season')?.value ?? Season.SPRING,
          year: this.data.activeYear,
        };

    const calendarEvent: UnsavedCalendarEvent = {
      title: this.eventForm.get('title')?.value ?? '',
      tag: this.eventForm.get('tag')?.value as Tag,
      description: this.eventForm.get('description')?.value ?? '',
      gameDate,
    };

    this.dialogRef.close({ calendarEvent });
  }
}
