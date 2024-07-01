import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // generated in Strapi
  private apiKey =
    '795b3af756282b1fc8197e8d17355de9528d2ae8b03292020c95840a22268bbc31a9cf9466296611a6a23f48fcd55dea8a6303fb399a60a46b1ca2f071faaf1f3dc47a6c4e500b257c9e54c6fa625a6d6549b9ece7a9e1f81c6e410b71c55eb9f06465d6f56ffa21efabcd4c88767c7ec726a511238e9afcb85781b33bbb78e3';
  private apiUrl = 'http://localhost:1337/graphql';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    }),
  };
  constructor(private http: HttpClient) {}

  graphql<T>(query: string, variables?: Partial<T>) {
    return this.http
      .post(this.apiUrl, JSON.stringify({ query, variables }), this.httpOptions)
      .pipe(map((response: any) => response.data));
  }
}
