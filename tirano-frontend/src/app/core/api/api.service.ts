import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = environment.apiUrl + '/api';
  public backend_url = environment.apiUrl;

  constructor(private http: HttpClient) {}


  get<T>(endpoint: string, params?: any) {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];

        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value);
        }
      });
    }

    return this.http.get<T>(`${this.url}/${endpoint}`, {
      params: httpParams,
    });
  }

  post<T>(endpoint: string, data: any) {
    return this.http.post<T>(`${this.url}/${endpoint}`, data);
  }

  put<T>(endpoint: string, id: number | string, data: any) {
    return this.http.put<T>(`${this.url}/${endpoint}/${id}`, data);
  }

  putPath<T>(endpoint: string, data: any = {}) {
    return this.http.put<T>(`${this.url}/${endpoint}`, data);
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.url}/${endpoint}`);
  }
}
