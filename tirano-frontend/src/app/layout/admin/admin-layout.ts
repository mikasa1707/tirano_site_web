import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from './components/sidebar/sidebar';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {}
