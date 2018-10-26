import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap, take, filter } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { LoginCredentials, RegisterCredentials } from '../data/models/accountCredentials';
import * as claims from '../data/constants/claims';


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

  constructor(
    private http: HttpClient
  ) {
    this.loginUrl = 'api/account/login';
    this.registerUrl = 'api/account/register';
  }

  login(creds: LoginCredentials): Observable<Token> {
    return this.http.post<Token>(this.loginUrl, creds, httpOptions).pipe(
      tap((key) => {
        console.log(`login: ${creds.email} logged in.`);
      }),
      catchError(this.handleError<Token>('LoginCredentials'))
    );
  }

  register(creds: RegisterCredentials): Observable<UserId> {
    return this.http.post<UserId>(this.registerUrl, creds, httpOptions).pipe(
      tap((url) => console.log(`register: ${creds.email} registered.`)),
      catchError(this.handleError<UserId>('RegisterCredentials'))
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
   * @param token
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
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

interface UserId {
  id: string;
}

interface Token {
  token: string;
}
