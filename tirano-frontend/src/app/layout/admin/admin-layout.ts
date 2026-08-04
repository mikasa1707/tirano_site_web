import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { NavbarComponent } from './components/navbar/navbar';
import { ToastContainer } from "../../shared/components/toast-container/toast-container";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastContainer],
  templateUrl: './admin-layout.html',
})
export class AdminLayoutComponent {}
