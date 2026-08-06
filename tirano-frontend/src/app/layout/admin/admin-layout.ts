import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { NavbarComponent } from './components/navbar/navbar';
import { ToastContainer } from '../../shared/components/toast-container/toast-container';
import { NotificationService } from '../../core/services/notification';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastContainer],
  templateUrl: './admin-layout.html',
})
export class AdminLayoutComponent {
  constructor(
    private notifications: NotificationService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.notifications.listen().subscribe((event) => {
      if (event.type === 'MESSAGE_CREATED') {
        this.toast.success(`Nouveau message de ${event.data.fullname}`);
      }
    });
  }
}
