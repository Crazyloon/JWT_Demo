import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { LoginCredentials } from '../../data/models/accountCredentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isUnauthorizedUser: boolean;
  constructoisUnauthorizedUser: boolean;
  unauthorizedUserMessage: string;
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  @Input() savedUser: string;
  @ViewChild('rememberMe') rememberMe: ElementRef;

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    if (this.savedUser) {
      this.loginForm.patchValue({ username: this.savedUser });
      (this.rememberMe.nativeElement as HTMLInputElement).checked = true;
    }
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    const creds: LoginCredentials = { email: this.username.value, password: this.password.value };
    const remembered = (this.rememberMe.nativeElement as HTMLInputElement).checked;
    if (creds.email && creds.password) {
      this.accountService.login(creds).subscribe(token => {
        console.log(token);
        //if (token == 'Pending') {
        //  this.isUnauthorizedUser = true;
        //  this.unauthorizedUserMessage = pendingUserMessage;
        //}
        //else if (token == 'Disabled') {
        //  this.isUnauthorizedUser = true;
        //  this.unauthorizedUserMessage = disabledUserMessage;
        //}
        //else if (token) {
        //  localStorage.setItem(TOKEN, token);
        //  localStorage.setItem(USERID, this.accountService.getUserId(token));
        //  if (remembered) {
        //    localStorage.setItem(REMEMBERME, creds.email);
        //  } else {
        //    localStorage.removeItem(REMEMBERME);
        //  }

        //  const user = new User(this.username.value, token);
        //  this.loginService.setUser(user);
        //  this.loginService.userLoggedInEvent(user);

        //  this.router.navigate(['/dashboard']);
        //}
        //else {
        //  this.loginForm.setErrors(['Unabled to match username with password']);
        //}
      });
    }
  }

  onInput() {
    this.isUnauthorizedUser = false;
  }

  getRememberMe(): string {
    return localStorage.getItem('username');
  }
}
