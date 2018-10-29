import { Component, Input } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { LoginNotificationService } from '../../services/login-notification.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  @Input() isUserLoggedIn = false;
  isExpanded = false;

  constructor(private accountService: AccountService, private loginService: LoginNotificationService) { }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.collapse();
    this.accountService.removeToken();
    this.loginService.userLoggedOutEvent();
  }
}
