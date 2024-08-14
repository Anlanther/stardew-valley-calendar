import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from '../../../models/calendar-event.model';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
})
export class DeleteDialogComponent {
  dialogRef = inject(MatDialogRef<DeleteDialogComponent>);
  data: {
    id: string;
    name: string;
    object: 'calendar' | 'event';
    gameEvents?: CalendarEvent[];
  } = inject(MAT_DIALOG_DATA);

  deleteObject(): void {
    this.dialogRef.close({
      id: this.data.id,
      object: this.data.object,
      gameEvents: this.data.gameEvents,
    });
  }
}
