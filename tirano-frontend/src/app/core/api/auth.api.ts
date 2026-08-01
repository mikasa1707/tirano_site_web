import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './api.service';

const TOKEN_KEY = 'token_tirano';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  login(data: any) {
    return this.api.post<any>('auth/login', data);
  }

  saveToken(token: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
    }

    this.router.navigate(['/admin/login']);
  }
}
