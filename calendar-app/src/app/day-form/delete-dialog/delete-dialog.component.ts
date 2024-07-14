import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
})
export class DeleteDialogComponent {
  dialogRef = inject(MatDialogRef<DeleteDialogComponent>);

  deleteEvent() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
