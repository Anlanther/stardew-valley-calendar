import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { KEYS } from '../constants/keys.constant';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiKey = KEYS.STRAPI_KEY;
  private apiUrl = 'http://localhost:1337/graphql';

  constructor(private http: HttpClient) {}

  setToken(token: string) {
    this.apiKey = token;
  }

  graphql<Response>(
    query: string,
    variables?: { [key: string]: any },
  ): Observable<Response> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    return this.http
      .post(this.apiUrl, JSON.stringify({ query, variables }), {
        headers,
      })
      .pipe(
        map((response: any) => {
          if (response.errors) {
            throw Error(response.errors.map((e: any) => e.message));
          }
          return response.data;
        }),
        catchError((e) => {
          throw Error(JSON.stringify(e));
        }),
      );
  }
}
