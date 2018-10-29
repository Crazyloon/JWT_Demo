import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { RegisterCredentials } from '../../data/models/accountCredentials'
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

const defaultRegistrationFailureMessage = "Unable to register";
@Component({
  selector: 'app-register-form',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationFailureMessage: string = defaultRegistrationFailureMessage;
  isRegistrationSuccessful: boolean = true;
  isRequestInProgress: boolean = false;
  credentials: RegisterCredentials;
  registrationForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required, matchValidator('password')]]
  });

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registrationForm.valueChanges.subscribe(() => {
      this.isRegistrationSuccessful = true
      this.registrationFailureMessage = defaultRegistrationFailureMessage;
    });
  }

  get firstName() { return this.registrationForm.get('firstName'); }
  get lastName() { return this.registrationForm.get('lastName'); }
  get email() { return this.registrationForm.get('email'); }
  get phoneNumber() { return this.registrationForm.get('phoneNumber'); }
  get password() { return this.registrationForm.get('password'); }
  get passwordConfirm() { return this.registrationForm.get('passwordConfirm'); }

  onSubmit() {
    if(!this.registrationForm.valid){
      return;
    }

    this.isRequestInProgress = true;
    this.credentials = this.registrationForm.value;

    this.accountService.register(this.credentials)
      .subscribe(response => {
        if (response.status == 200) {
          this.router.navigate([`/login`]);
        }
      }, (httpError: HttpErrorResponse) => {
        this.registrationFailureMessage = httpError.error;
        this.isRegistrationSuccessful = false;
        this.isRequestInProgress = false;
      }, () => this.isRequestInProgress = false);
  }
}

export function matchValidator(fieldName: string) {
  let fcfirst: FormControl;
  let fcSecond: FormControl;

  return function matchValidator(control: FormControl) {

      if (!control.parent) {
          return null;
      }

      // INITIALIZING THE VALIDATOR.
      if (!fcfirst) {
          //INITIALIZING FormControl first
          fcfirst = control;
          fcSecond = control.parent.get(fieldName) as FormControl;

          //FormControl Second
          if (!fcSecond) {
              throw new Error('matchValidator(): Second control is not found in the parent group!');
          }

          fcSecond.valueChanges.subscribe(() => {
              fcfirst.updateValueAndValidity();
          });
      }

      if (!fcSecond) {
          return null;
      }

      if (fcSecond.value !== fcfirst.value) {
          return {
              mismatch: true
          };
      }

      return null;
  }
}
