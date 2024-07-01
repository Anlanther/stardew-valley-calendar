import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Calendar } from '../../models/calendar.model';
import { DataService } from '../data.service';
import { StrapiCollection } from '../models/strapi-collection.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarDataService {
  private dataService = inject(DataService);

  create(name: string): Observable<Calendar> {
    return this.dataService
      .graphql<Calendar>(this.getCreateQuery(), { name })
      .pipe(
        map((response) => {
          return response.createCalendar.data.map(
            (calendar: StrapiCollection<Calendar>) => ({
              ...calendar.attributes,
              id: calendar.id,
            })
          );
        })
      );
  }

  private getCreateQuery() {
    return `
    mutation createCalendar($name: String) {
      createCalendar(data: { name: $name }) {
        data {
          id
          attributes {
            name
            calendarEvents {
              data {
                id
              }
            }
          }
        }
      }
    }
    `;
  }
}
