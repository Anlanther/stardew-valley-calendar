import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-dialog',
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
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.scss',
})
export class CreateDialogComponent {
  calendarNameFormControl = new FormControl('', [Validators.required]);

  dialogRef = inject(MatDialogRef<CreateDialogComponent>);

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
