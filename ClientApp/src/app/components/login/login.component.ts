import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { LoginCredentials } from '../../data/models/accountCredentials';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginNotificationService } from '../../services/login-notification.service';
import { User } from '../../data/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isUserUnauthorized: boolean;
  loginFailureMessage: string = "The Username and Password combination does not match our records.";
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });
  @Input() savedUser: string;

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router, private loginService: LoginNotificationService) { }

  ngOnInit() {
    this.savedUser = this.accountService.getSavedUser();
    if (this.savedUser) {
      this.loginForm.patchValue({
        username: this.savedUser,
        rememberMe: true
      });
    }

    this.loginForm.valueChanges.subscribe(() => this.isUserUnauthorized = false)
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }

  onSubmit() {
    const remembered = this.rememberMe.value;
    const creds: LoginCredentials = { email: this.username.value, password: this.password.value, rememberMe: remembered };
    if (creds.email && creds.password) {
      this.accountService.login(creds).subscribe(response => {
        if (response.status == 200) {
          let data = response.body;
          this.accountService.setToken(data.token);

          this.loginService.userLoggedInEvent(new User(creds.email, data.token));
          
          this.router.navigate(['/home']);
        }
      }, (error: HttpErrorResponse) => {
        this.isUserUnauthorized = true;
        this.loginFailureMessage = error.error;
      });
    } else {
      this.isUserUnauthorized = true;
      this.loginFailureMessage = "You must enter a Username and Password to login.";
    }
  }

  getRememberMe(): string {
    return localStorage.getItem('username');
  }
}
