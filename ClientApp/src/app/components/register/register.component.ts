import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { RegisterCredentials } from '../../data/models/accountCredentials'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  creds: RegisterCredentials;
  registrationForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  get firstName() { return this.registrationForm.get('firstName'); }
  get lastName() { return this.registrationForm.get('lastName'); }
  get email() { return this.registrationForm.get('email'); }
  get phone() { return this.registrationForm.get('phone'); }
  get password() { return this.registrationForm.get('password'); }

  onSubmit() {
    this.creds = {
      email: this.email.value,
      password: this.password.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      phoneNumber: this.phone.value
    }

    this.accountService.register(this.creds)
      .subscribe(redirectTo => {
        if (redirectTo) {
          this.router.navigate([`/login`]);
        }
      }
    );
  }
}
