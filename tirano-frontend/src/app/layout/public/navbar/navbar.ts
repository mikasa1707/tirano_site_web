import { Component, OnInit } from '@angular/core';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit{

  constructor(public readonly settings: SiteSettingsService) {
  }

  ngOnInit(): void {
    console.log(this.settings.setting);
  }


}
