import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function duplicateNameValidator(calendarNames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.value;
    const isDuplicate = calendarNames.includes(name);

    return isDuplicate ? { duplicateName: true } : null;
  };
}
