import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap, take, filter } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { LoginCredentials, RegisterCredentials } from '../data/models/accountCredentials';
import * as claims from '../data/constants/claims';
import { tokenName } from '@angular/compiler';


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
  login(creds: LoginCredentials): Observable<Token> {
    return this.http.post<Token>(this.loginUrl, creds, httpOptions).pipe(
      tap((key) => {
        console.log(`login: ${creds.email} logged in.`);
      }),
      catchError(this.handleError<Token>('LoginCredentials'))
      );
    }
    

    /**
   * Creates an observable that can be used to register a new user
   * @param creds A RegisterCredentials object that contains details about the new user
   */
  register(creds: RegisterCredentials): Observable<HttpResponse<Object>> {
    
    return this.http.post<HttpResponse<Object> | any>(this.registerUrl, creds, { headers: httpOptions.headers, observe: "response" })
      .pipe(
        map(response => {
          console.log(response);
        }),
        tap((url) => console.log(`register: ${creds.email} registered.`)),
        catchError(this.handleError<HttpResponse<Object> | any>('RegisterCredentials'))
      );
      //.map<HttpErrorResponse, void>(r => {
      //    console.log("failed", r.error);
      //  if (r.status != 200) {
      //  }
      //})
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
