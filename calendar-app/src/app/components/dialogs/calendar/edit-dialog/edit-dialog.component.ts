import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Calendar } from '../../../../models/calendar.model';
import { duplicateNameValidator } from '../../../../services/form-validators.utils';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditCalendarDialogComponent {
  private fb = inject(FormBuilder);

  calendarForm!: FormGroup;

  dialogRef = inject(MatDialogRef<EditCalendarDialogComponent>);
  data: {
    activeCalendar: Calendar;
    year: number;
    existingCalendars: string[];
  } = inject(MAT_DIALOG_DATA);

  constructor() {
    this.calendarForm = this.fb.group({
      name: [
        this.data.activeCalendar.name,
        [
          Validators.required,
          duplicateNameValidator(
            this.data.existingCalendars.filter(
              (name) => name !== this.data.activeCalendar.name,
            ),
          ),
        ],
      ],
      description: [this.data.activeCalendar.description],
      year: [this.data.year, [Validators.required]],
      includeBirthdays: [
        this.data.activeCalendar.systemConfig.includeBirthdays,
      ],
      includeFestivals: [
        this.data.activeCalendar.systemConfig.includeFestivals,
      ],
      includeCrops: [this.data.activeCalendar.systemConfig.includeCrops],
    });
  }

  editCalendar() {
    const name = this.calendarForm.get('name')!.value;
    const includeBirthdays = this.calendarForm.get('includeBirthdays')!.value;
    const includeFestivals = this.calendarForm.get('includeFestivals')!.value;
    const includeCrops = this.calendarForm.get('includeCrops')!.value;
    const description = this.calendarForm.get('description')!.value;
    const year = this.calendarForm.get('year')!.value;

    const calendar: Partial<Calendar> = {
      id: this.data.activeCalendar.id,
      name,
      description,
      systemConfig: { includeBirthdays, includeFestivals, includeCrops },
    };

    this.dialogRef.close({
      fullActiveCalendar: this.data.activeCalendar,
      calendar,
      year,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
