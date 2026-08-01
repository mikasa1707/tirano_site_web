import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/api/auth.api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  constructor(private readonly authService: AuthService) {}
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
