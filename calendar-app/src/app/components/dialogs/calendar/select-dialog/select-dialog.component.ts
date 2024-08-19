import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarState } from '../../../../models/calendar-state.model';
import { Calendar } from '../../../../models/calendar.model';

@Component({
  selector: 'app-select-calendar-dialog',
  templateUrl: './select-dialog.component.html',
  styleUrl: './select-dialog.component.scss',
})
export class SelectCalendarDialogComponent {
  dialogRef = inject(MatDialogRef<SelectCalendarDialogComponent>);
  data: { availableCalendars: Calendar[]; activeCalendar: CalendarState } =
    inject(MAT_DIALOG_DATA);

  availableCalendarsFormControl = new FormControl<null | string>(null);

  constructor() {
    if (this.data.activeCalendar) {
      this.availableCalendarsFormControl.setValue(this.data.activeCalendar.id);
    }
  }

  confirm() {
    const selectedCalendarId = this.availableCalendarsFormControl.value!;
    this.dialogRef.close({
      id: selectedCalendarId,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
