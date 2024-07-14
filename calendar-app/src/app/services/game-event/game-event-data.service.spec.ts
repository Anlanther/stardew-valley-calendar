import {
  SpectatorService,
  SpyObject,
  createServiceFactory,
} from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { Story } from '../../models/story.model';
import { DataService } from '../data.service';
import { StoryCollection } from '../models/story-collection.model';
import { StoryDataService } from './game-event-data.service';

describe('StoryDataService', () => {
  const mockResponse: { attributes: StoryCollection }[] = [
    {
      attributes: {
        title: 'Story1',
        author: 'A1',
      },
    },
    {
      attributes: {
        title: 'Story2',
        author: 'A2',
      },
    },
    { attributes: { title: 'Matilda', author: 'Roald Dahl' } },
    { attributes: { title: 'Fantastic Mr. Fox', author: 'Roald Dahl' } },
  ];

  let spectator: SpectatorService<StoryDataService>;
  let mockDataService: SpyObject<DataService>;

  const createService = createServiceFactory({
    service: StoryDataService,
    mocks: [DataService],
  });

  beforeEach(() => {
    spectator = createService();
    mockDataService = spectator.inject(DataService);
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('getStoriess', () => {
    it('should call on the dataService with a query string', () => {
      mockDataService.graphql.mockReturnValue(
        of({ data: { appStories: { data: mockResponse } } }),
      );

      spectator.service.getStories();

      expect(mockDataService.graphql).toHaveBeenCalledWith(expect.any(String));
    });

    it('should transform a StoryCollection into an array of Stories and return it', () => {
      mockDataService.graphql.mockReturnValue(
        of({ data: { appUsers: { data: mockResponse } } }),
      );
      const expectedReturn: Story[] = [
        {
          title: 'Story1',
          author: 'A1',
        },
        {
          title: 'Story2',
          author: 'A2',
        },
        { title: 'Matilda', author: 'Roald Dahl' },
        { title: 'Fantastic Mr. Fox', author: 'Roald Dahl' },
      ];

      spectator.service.getStories().subscribe((result) => {
        expect(result).toStrictEqual(expectedReturn);
      });
    });
  });
});
