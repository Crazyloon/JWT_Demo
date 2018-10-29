import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import * as claims from '../data/constants/claims';
import { LoginCredentials, RegisterCredentials } from '../data/models/accountCredentials';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

export const TOKEN: string = "token";
export const USERID: string = 'userID';
export const REMEMBERME: string = 'rememberMe';

@Injectable()
export class AccountService {
  private loginUrl: string;
  private registerUrl: string;

  constructor(private http: HttpClient) {
    this.loginUrl = 'api/account/login';
    this.registerUrl = 'api/account/register';
  }
  /**
   * Creates an observable that can be used to log a new user in
   * @param creds A LoginCredentials object that contains the users login details.
   */
  login(creds: LoginCredentials): Observable<HttpResponse<Token>> {
    return this.http.post<Token>(this.loginUrl, creds, { ...httpOptions, observe: "response" })
    .pipe(
      catchError((err) => Observable.throw(err))
    );
  }
    

    /**
   * Creates an observable that can be used to register a new user
   * @param creds A RegisterCredentials object that contains details about the new user
   */
  register(creds: RegisterCredentials): Observable<HttpResponse<UserId>> {    
    return this.http.post<UserId>(this.registerUrl, creds, { ...httpOptions, observe: "response" })
    .pipe(
      catchError(err => Observable.throw(err))
    );
  }

  /**
   * Gets a token from local storage
   */
  getToken(): string {
    return localStorage.getItem(TOKEN)
  }

  /**
   * Stores a token in the browsers local storage
   * @param token the JWT token to store in local storage
   */
  setToken(token: string) {
    localStorage.setItem(TOKEN, `Bearer ${token}`);
  }

  /**
   * Removes the stored JWT from local storage
   * */
  removeToken(): any {
    localStorage.removeItem(TOKEN);
  }

  /**
   * Gets a user id from the token
   * @param token the JWT token stored in local storage
   */
  getUserId(token?: string): string {
    if (!token) token = this.getToken();
    if (!token) return null;

    const decoded = jwt_decode(token);
    const nameIdentifier = decoded[claims.userId];

    if (nameIdentifier === undefined) {
      return null;
    }
    return nameIdentifier;
  }

  /**
   * Gets the expiration date of the token
   * @param token the JWT token stored in local storage
   */
  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  /**
   * Checks for a token expiration date
   * @param token a JWT token that has an "exp" claim
   * @returns true if the token was not found or has expired
   */
  isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const expirationDate = this.getTokenExpirationDate(token);
    if (expirationDate === undefined) return false;
    return !(expirationDate.valueOf() > new Date().valueOf());
  }

  /**
   * Retrieves a "user" claim stored in a token
   * @returns the username, or an empty string if no user is found.
   * */
  getSavedUser(token?: string): string {
    if (!token) token = this.getToken();
    if (!token) return "";

    const decoded = jwt_decode(token);

    if (decoded.user === undefined)
      return "";

    return decoded.user as string;
  }
}

interface UserId {
  id: string;
}

interface Token {
  token: string;
}
