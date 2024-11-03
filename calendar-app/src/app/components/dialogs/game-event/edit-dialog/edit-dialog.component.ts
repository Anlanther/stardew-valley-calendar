import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TAG_METADATA } from '../../../../constants/tag-metadata.constant';
import { GameDate } from '../../../../models/game-date.model';
import { GameEvent } from '../../../../models/game-event.model';
import { TagCategory } from '../../../../models/tag-category.model';
import { Tag } from '../../../../models/tag.model';
import { uniqueTitleTagValidator } from '../../../../services/form-validators.utils';

@Component({
  selector: 'app-edit-event-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditEventDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<EditEventDialogComponent>);
  data: {
    gameEvent: GameEvent;
    activeYear: number;
    existingEvents: GameEvent[];
  } = inject(MAT_DIALOG_DATA);

  eventForm!: FormGroup;

  selectedTag: string = 'Tag*';

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
    this.selectedTag = this.getTagDisplayName(this.data.gameEvent.tag);
    this.eventForm = this.fb.group(
      {
        title: [
          this.data.gameEvent.title,
          [Validators.required, Validators.maxLength(50)],
        ],
        description: [this.data.gameEvent.description],
        tag: [this.data.gameEvent.tag, [Validators.required]],
        isRecurring: [this.data.gameEvent.gameDate.isRecurring],
      },
      {
        validators: uniqueTitleTagValidator(
          this.data.existingEvents.filter(
            (event) =>
              event.title !== this.data.gameEvent.title &&
              event.tag !== this.data.gameEvent.tag,
          ),
        ),
      },
    );
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

  updateSelectedTag(value: Tag) {
    this.selectedTag = this.getTagDisplayName(value);
    this.eventForm.get('tag')?.patchValue(value);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private getTagDisplayName(tag: string) {
    return TAG_METADATA.get(tag as Tag)!.displayName;
  }

  private filterTag(category: TagCategory) {
    const tags: { tag: Tag; displayName: string }[] = [];
    TAG_METADATA.forEach(
      (_, key) =>
        TAG_METADATA.get(key)!.category === category &&
        tags.push({
          tag: key,
          displayName: TAG_METADATA.get(key)!.displayName,
        }),
    );
    return tags;
  }
}
