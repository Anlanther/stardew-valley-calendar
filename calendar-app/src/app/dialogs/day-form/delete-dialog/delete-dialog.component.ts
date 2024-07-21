import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-event-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
})
export class DeleteEventDialogComponent {
  dialogRef = inject(MatDialogRef<DeleteEventDialogComponent>);

  deleteEvent() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
