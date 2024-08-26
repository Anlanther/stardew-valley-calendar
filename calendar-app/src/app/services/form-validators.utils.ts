import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { GameEvent } from '../models/game-event.model';

export function duplicateNameValidator(calendarNames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.value;
    const isDuplicate = calendarNames.includes(name);

    return isDuplicate ? { duplicateName: true } : null;
  };
}

export function uniqueTitleTagValidator(
  existingEvents: GameEvent[],
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const titleControl = control.get('title');
    const tagControl = control.get('tag');

    if (!titleControl || !tagControl) {
      return null;
    }

    const title = titleControl.value;
    const tag = tagControl.value;

    const existingEvent = existingEvents.find(
      (event) => event.title === title && event.tag === tag,
    );

    if (existingEvent) {
      return { uniqueTitleTag: true };
    }

    return null;
  };
}
