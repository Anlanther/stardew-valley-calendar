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
      description: [''],
      includeBirthdays: [false],
      includeFestivals: [false],
      includeCrops: [false],
    });
  }

  createCalendar() {
    const calendarName = this.calendarForm.get('name')!.value;
    const includeBirthdays = this.calendarForm.get('includeBirthdays')!.value;
    const includeFestivals = this.calendarForm.get('includeFestivals')!.value;
    const includeCrops = this.calendarForm.get('includeCrops')!.value;
    const description = this.calendarForm.get('description')!.value;

    this.dialogRef.close({
      name: calendarName,
      includeBirthdays,
      includeFestivals,
      includeCrops,
      description,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
