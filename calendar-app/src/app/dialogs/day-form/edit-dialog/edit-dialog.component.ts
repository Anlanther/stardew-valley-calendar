import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-event-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditEventDialogComponent {
  dialogRef = inject(MatDialogRef<EditEventDialogComponent>);

  editEvent() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
