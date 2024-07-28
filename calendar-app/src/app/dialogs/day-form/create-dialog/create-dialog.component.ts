import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UnsavedCalendarEvent } from '../../../models/calendar-event.model';
import { UnsavedGameDate } from '../../../models/game-date.model';
import { Season } from '../../../models/season.model';
import { Tag } from '../../../models/tag.model';

@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.scss',
})
export class CreateEventDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<CreateEventDialogComponent>);
  data: { day: number; season: Season; year: number } = inject(MAT_DIALOG_DATA);

  eventForm!: FormGroup;
  tags = Object.values(Tag);

  constructor() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      tag: ['', [Validators.required]],
      isRecurring: [false],
    });
  }

  createEvent() {
    const isRecurring: boolean = this.eventForm.get('isRecurring')?.value;

    const gameDate: UnsavedGameDate = isRecurring
      ? {
          day: this.data.day,
          isRecurring: true,
          season: this.eventForm.get('season')?.value ?? Season.SPRING,
        }
      : {
          day: this.data.day,
          isRecurring: false,
          season: this.eventForm.get('season')?.value ?? Season.SPRING,
          year: this.data.year,
        };

    const calendarEvent: UnsavedCalendarEvent = {
      title: this.eventForm.get('title')?.value ?? '',
      tag: this.eventForm.get('tag')?.value as Tag,
      description: this.eventForm.get('description')?.value ?? '',
      gameDate,
    };

    this.dialogRef.close({ calendarEvent });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
