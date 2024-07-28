import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Season } from '../../../models/season.model';
import { Tag } from '../../../models/tag.model';

@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.scss',
})
export class CreateEventDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<CreateEventDialogComponent>);
  data: { day: number; season: Season; year: number } = inject(MAT_DIALOG_DATA);

  eventForm!: FormGroup;
  tags = Object.keys(Tag);

  constructor() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      tag: ['', [Validators.required]],
      isRecurring: [false],
    });
  }

  createEvent() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
