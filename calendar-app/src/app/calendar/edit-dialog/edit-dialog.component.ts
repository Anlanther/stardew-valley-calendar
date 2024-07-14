import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CalendarState } from '../../models/calendar-state.model';
import { Calendar } from '../../models/calendar.model';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditDialogComponent {
  dialogRef = inject(MatDialogRef<EditDialogComponent>);
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
