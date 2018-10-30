import { Component, Input } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { LoginNotificationService } from '../../services/login-notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  @Input() isUserLoggedIn = false;
  isExpanded = false;

  constructor(private accountService: AccountService, private loginService: LoginNotificationService, private router: Router) { }

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
    this.router.navigate(['/home']);
  }
}
