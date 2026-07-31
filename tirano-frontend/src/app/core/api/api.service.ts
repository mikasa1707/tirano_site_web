import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.url}/${endpoint}`);
  }

  post<T>(endpoint: string, data: any) {
    return this.http.post<T>(`${this.url}/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any) {
    return this.http.put<T>(`${this.url}/${endpoint}`, data);
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.url}/${endpoint}`);
  }
}
