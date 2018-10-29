import { Injectable } from '@angular/core';
import { User } from '../data/models/user';
import { Subject } from 'rxjs';

@Injectable()
export class LoginNotificationService {
  private user: User;
  private _userLoggedInEvent = new Subject();
  userLoggedIn$ = this._userLoggedInEvent.asObservable();
  private _userLoggedOutEvent = new Subject();
  userLoggedOut$ = this._userLoggedOutEvent.asObservable();

  constructor() { }

  setUser(user: User) {
    this.user = user;
  }

  userLoggedInEvent(user: User) {
    this._userLoggedInEvent.next(user);
  }

  userLoggedOutEvent() {
    this._userLoggedOutEvent.next('logout');
  }
}
