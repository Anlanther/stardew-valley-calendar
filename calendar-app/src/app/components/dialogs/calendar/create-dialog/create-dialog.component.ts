import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-calendar-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.scss',
})
export class CreateCalendarDialogComponent {
  private fb = inject(FormBuilder);

  calendarForm!: FormGroup;

  dialogRef = inject(MatDialogRef<CreateCalendarDialogComponent>);

  constructor() {
    this.calendarForm = this.fb.group({
      name: ['', [Validators.required]],
      includeBirthday: [false],
      includeFestivals: [false],
      includeCrops: [false],
    });
  }

  createCalendar() {
    const calendarName = this.calendarForm.get('name')!.value;
    const includeBirthday = this.calendarForm.get('includeBirthday')!.value;
    const includeFestivals = this.calendarForm.get('includeFestivals')!.value;
    const includeCrops = this.calendarForm.get('includeCrops')!.value;

    this.dialogRef.close({
      name: calendarName,
      includeBirthday,
      includeFestivals,
      includeCrops,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
