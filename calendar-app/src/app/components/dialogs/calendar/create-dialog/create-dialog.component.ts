import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { duplicateNameValidator } from '../../../../services/form-validators.utils';

@Component({
  selector: 'app-create-calendar-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.scss',
})
export class CreateCalendarDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<CreateCalendarDialogComponent>);
  data: { existingCalendars: string[] } = inject(MAT_DIALOG_DATA);

  calendarForm!: FormGroup;

  constructor() {
    this.calendarForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          duplicateNameValidator(this.data.existingCalendars),
        ],
      ],
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
