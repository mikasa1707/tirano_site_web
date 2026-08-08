import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-public-navbar',
  standalone: true,

  imports: [RouterLink, RouterLinkActive],

  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(public readonly settings: SiteSettingsService) {}
}
