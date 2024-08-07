import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-calendar-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.scss',
})
export class CreateCalendarDialogComponent {
  calendarNameFormControl = new FormControl('', [Validators.required]);

  dialogRef = inject(MatDialogRef<CreateCalendarDialogComponent>);

  createCalendar() {
    const calendarName = this.calendarNameFormControl.value!;
    this.dialogRef.close({
      name: calendarName,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
