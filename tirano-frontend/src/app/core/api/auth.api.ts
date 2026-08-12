import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './api.service';

const TOKEN_KEY = 'token_tirano';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly api: ApiService,
    private readonly router: Router,
  ) {}

  // =========================================================
  // LOGIN
  // =========================================================

  login(data: any) {
    return this.api.post<any>('auth/login', data);
  }

  // =========================================================
  // TOKEN
  // =========================================================

  saveToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  }

  // =========================================================
  // TOKEN VALIDITY
  // =========================================================

  isTokenValid(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        return false;
      }

      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      /*
       * Le backend utilise :
       *
       * expiresIn: '15m'
       *
       * JWT exp est exprimé en secondes.
       */

      if (!payload.exp) {
        return false;
      }

      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // =========================================================
  // AUTHENTICATED
  // =========================================================

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  // =========================================================
  // CLEAR
  // =========================================================

  clearToken(): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {
    this.clearToken();

    this.router.navigate(['/admin/login']);
  }
}
