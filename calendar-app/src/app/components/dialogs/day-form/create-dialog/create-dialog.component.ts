import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TAG_METADATA } from '../../../../constants/tag-metadata.constant';
import { UnsavedGameDate } from '../../../../models/game-date.model';
import { UnsavedGameEvent } from '../../../../models/game-event.model';
import { Season } from '../../../../models/season.model';
import { TagCategory } from '../../../../models/tag-category.model';
import { Tag } from '../../../../models/tag.model';
import { Type } from '../../../../models/type.model';

@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.scss',
})
export class CreateEventDialogComponent {
  private fb = inject(FormBuilder);
  private titleCase = inject(TitleCasePipe);
  dialogRef = inject(MatDialogRef<CreateEventDialogComponent>);
  data: { day: number; season: Season; year: number } = inject(MAT_DIALOG_DATA);

  eventForm!: FormGroup;

  get activitiesTags() {
    return this.filterTag(TagCategory.ACTIVITY).map((tag) =>
      this.titleCase.transform(tag),
    );
  }

  get cropsTags() {
    return this.filterTag(TagCategory.CROP).map((tag) =>
      this.titleCase.transform(tag),
    );
  }

  get charactersTags() {
    return this.filterTag(TagCategory.CHARACTER).map((tag) =>
      this.titleCase.transform(tag),
    );
  }

  constructor() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      tag: [null, [Validators.required]],
      isRecurring: [false],
    });
  }

  createEvent() {
    const isRecurring: boolean = this.eventForm.get('isRecurring')?.value;

    const gameDate: UnsavedGameDate = isRecurring
      ? {
          day: this.data.day,
          isRecurring: true,
          season: this.data.season,
        }
      : {
          day: this.data.day,
          isRecurring: false,
          season: this.data.season,
          year: this.data.year,
        };

    const gameEvent: UnsavedGameEvent = {
      title: this.eventForm.get('title')?.value ?? '',
      tag: this.eventForm.get('tag')?.value as Tag,
      description: this.eventForm.get('description')?.value ?? '',
      type: Type.User,
      gameDate,
    };

    this.dialogRef.close({ gameEvent });
  }

  updateSelectedTag(value: string) {
    this.eventForm.get('tag')?.patchValue(value.toLowerCase());
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
