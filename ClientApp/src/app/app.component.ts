import { Component, OnInit } from '@angular/core';
import { LoginNotificationService } from './services/login-notification.service';
import { User } from './data/models/user';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'JWT Auth Demo';
  isUserLoggedIn: boolean = false;

  constructor(private loginService: LoginNotificationService, private authService: AccountService) {
    loginService.userLoggedIn$.subscribe((u: User) => {
      if (u) {
        this.isUserLoggedIn = true;
      }
    });

    loginService.userLoggedOut$.subscribe(() => {
      this.isUserLoggedIn = false;
    })
  }

  ngOnInit() {
    this.isUserLoggedIn = !this.authService.isTokenExpired();
  }
}
