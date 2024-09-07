import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { KEYS } from '../constants/keys.constant';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiKey = KEYS.STRAPI_KEY;
  private apiUrl = 'http://localhost:1337/graphql';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    }),
  };
  constructor(private http: HttpClient) {}

  graphql(query: string, variables?: { [key: string]: any }) {
    return this.http
      .post(this.apiUrl, JSON.stringify({ query, variables }), this.httpOptions)
      .pipe(
        map((response: any) => response.data),
        catchError((e) => {
          throw Error(e);
        }),
      );
  }
}
