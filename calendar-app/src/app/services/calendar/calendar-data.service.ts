import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Story } from '../../models/story.model';
import { DataService } from '../data.service';
import { StoryCollection } from '../models/story-collection.model';

@Injectable({
  providedIn: 'root',
})
export class StoryDataService {
  constructor(private dataService: DataService) {}

  getStories(): Observable<Story[]> {
    const queryName = `getStories`;

    return this.dataService.graphql<Story>(this.getQuery(queryName)).pipe(
      map((response) => {
        return response.appStories.data.map(
          (story: { attributes: StoryCollection }) => ({ ...story.attributes })
        );
      })
    );
  }

  private getQuery(queryName: string, settings?: string) {
    return `query ${queryName}{
      appStories ${settings ?? ''}{
        data {
          attributes {
            title
            author
          }
        }
      }
    }
    `;
  }
}
