import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SelectCalendarDialogComponent } from '../calendar/select-dialog/select-dialog.component';

@Component({
  selector: 'app-token-dialog',
  templateUrl: './token-dialog.component.html',
  styleUrl: './token-dialog.component.scss',
})
export class TokenDialogComponent {
  dialogRef = inject(MatDialogRef<SelectCalendarDialogComponent>);

  tokenForm = new FormControl<null | string>(null);

  confirm() {
    const token = this.tokenForm.value!;
    this.dialogRef.close({
      token,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
