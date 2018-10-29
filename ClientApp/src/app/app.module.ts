import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { CounterComponent } from './components/counter/counter.component';
import { FetchDataComponent } from './components/fetch-data/fetch-data.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AccountService } from './services/account.service';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginNotificationService } from './services/login-notification.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgotpassword', component: ForgotPasswordComponent },
      { path: 'home', component: HomeComponent },
      { path: 'counter', component: CounterComponent, canActivate: [AuthGuard]}, // AuthGuard on components we wish to protect against unauthorized users
      { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthGuard] },

    ])
  ],
  providers: [
    AccountService,
    LoginNotificationService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
