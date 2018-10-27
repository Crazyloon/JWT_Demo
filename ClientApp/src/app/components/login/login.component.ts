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
  isUserUnauthorized: boolean;
  loginFailureMessage: string = "The username and password combination does not match our records.";
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });
  @Input() savedUser: string;
  //@ViewChild('rememberMe') rememberMe: ElementRef; // Ideally a form group should include all inputs. This line shows an example of how you can reference an HTML element on a page.

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    this.savedUser = this.accountService.getSavedUser();
    if (this.savedUser) {
      this.loginForm.patchValue({
        username: this.savedUser,
        rememberMe: true
      });
    }
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }

  onSubmit() {
    const remembered = this.rememberMe.value;
    const creds: LoginCredentials = { email: this.username.value, password: this.password.value, rememberMe: remembered };
    if (creds.email && creds.password) {
      this.accountService.login(creds).subscribe(jwt => {
        if (jwt) {
          console.log(jwt); // An object should be returned with this JSON structure { token: "eyJhbG..." }
          this.accountService.setToken(jwt.token);
          this.router.navigate(['/home']);
        }
      }, (error) => {
        console.error(error);
        this.loginFailureMessage = "The username and password you provided to not match.";
      });
    } else {
      this.isUserUnauthorized = true;
      this.loginFailureMessage = "You must enter a username and password to login.";
    }
  }

  onInput() {
    this.isUserUnauthorized = false;
  }

  getRememberMe(): string {
    return localStorage.getItem('username');
  }
}
