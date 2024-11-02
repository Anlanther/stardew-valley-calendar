import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinalSuffix',
  standalone: true,
})
export class OrdinalSuffixPipe implements PipeTransform {
  transform(selectedDate: string): string {
    if (!this.isValidDate(selectedDate)) {
      throw new Error('Invalid date format');
    }

    const day = +selectedDate.split(' ')[0];
    const suffix = this.getSuffix(day);
    const suffixedDate = `${day}${suffix} ${selectedDate.split(' ')[1]}`;
    return suffixedDate;
  }

  private isValidDate(dateString: string): boolean {
    const parts = dateString.split(' ');
    return (
      parts.length === 2 && !isNaN(+parts[0]) && Number.isInteger(+parts[0])
    );
  }

  private getSuffix(number: number): string {
    if (number > 3 && number < 21) return 'th';
    switch (number % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
