import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-year-dialog',
  templateUrl: './update-year-dialog.component.html',
  styleUrl: './update-year-dialog.component.scss',
})
export class UpdateYearDialogComponent {
  dialogRef = inject(MatDialogRef<UpdateYearDialogComponent>);
  data: { activeYear: number } = inject(MAT_DIALOG_DATA);

  yearFormControl = new FormControl(1, [
    Validators.required,
    Validators.min(1),
  ]);

  constructor() {
    this.yearFormControl.setValue(this.data.activeYear);
  }

  updateYear() {
    const activeYear: number = this.yearFormControl.value!;
    this.dialogRef.close({ activeYear });
  }
}
