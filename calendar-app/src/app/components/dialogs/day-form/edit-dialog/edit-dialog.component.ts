import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TAG_METADATA } from '../../../../constants/tag-metadata.constant';
import { GameDate } from '../../../../models/game-date.model';
import { GameEvent } from '../../../../models/game-event.model';
import { TagCategory } from '../../../../models/tag-category.model';
import { Tag } from '../../../../models/tag.model';

@Component({
  selector: 'app-edit-event-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditEventDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<EditEventDialogComponent>);
  data: { gameEvent: GameEvent; activeYear: number } = inject(MAT_DIALOG_DATA);

  eventForm!: FormGroup;

  get activitiesTags() {
    return this.filterTag(TagCategory.ACTIVITY);
  }

  get cropsTags() {
    return this.filterTag(TagCategory.CROP);
  }

  get charactersTags() {
    return this.filterTag(TagCategory.CHARACTER);
  }

  constructor() {
    this.eventForm = this.fb.group({
      title: [this.data.gameEvent.title, [Validators.required]],
      description: [this.data.gameEvent.description],
      tag: [this.data.gameEvent.tag, [Validators.required]],
      isRecurring: [this.data.gameEvent.gameDate.isRecurring],
    });
  }

  editEvent() {
    const isRecurring: boolean = this.eventForm.get('isRecurring')?.value;

    const gameDate: GameDate = isRecurring
      ? {
          day: this.data.gameEvent.gameDate.day,
          isRecurring: true,
          season: this.data.gameEvent.gameDate.season,
          id: this.data.gameEvent.gameDate.id,
        }
      : {
          day: this.data.gameEvent.gameDate.day,
          isRecurring: false,
          season: this.data.gameEvent.gameDate.season,
          year: this.data.activeYear,
          id: this.data.gameEvent.gameDate.id,
        };

    const gameEvent: GameEvent = {
      title: this.eventForm.get('title')?.value ?? '',
      tag: this.eventForm.get('tag')?.value as Tag,
      description: this.eventForm.get('description')?.value ?? '',
      gameDate,
      id: this.data.gameEvent.id,
      type: this.data.gameEvent.type,
      publishedAt: this.data.gameEvent.publishedAt,
    };

    this.dialogRef.close({ gameEvent });
  }

  updateSelectedTag(value: string) {
    this.eventForm.get('tag')?.patchValue(value);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private filterTag(category: TagCategory) {
    const tags: Tag[] = [];
    TAG_METADATA.forEach(
      (_, key) =>
        TAG_METADATA.get(key)!.category === category && tags.push(key),
    );
    return tags;
  }
}
