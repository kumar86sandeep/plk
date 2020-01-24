import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup

import { ToastrModule } from 'ng6-toastr-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
 
//components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

//shared components and services
import { AlertComponent } from './core/shared/components/alert/alert.component';
import { PageLoaderComponent } from './core/shared/components/page-loader/page-loader.component';
import { HeaderComponent } from './core/shared/components/header/header.component';
import { FormValidationErrorsComponent } from './core/shared/components/form-validation-errors/form-validation-errors.component';
import { PageLoaderService, AlertService } from './core/shared/_services'

//services
import { DataService,VehicleService, CommonUtilsService, UserAuthService, TitleService } from './core/services';

//importing intercepters
import { ApiIntercepter } from './core/intercepters/api.intercepter';
import { TokenInterceptor } from './core/intercepters/token.interceptor';
import { HttpErrorInterceptor } from './core/intercepters/http-error.interceptor';


 


let socialLoginConfig = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("810408252310-utettln2qhf888p02kfo4400mj5g842d.apps.googleusercontent.com")
  }
]);
export function provideConfig() {
  return socialLoginConfig;
}

@NgModule({
  declarations: [
    AppComponent,   
    LoginComponent,
    PageLoaderComponent,
    HeaderComponent,
    AlertComponent,
    FormValidationErrorsComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFontAwesomeModule,        
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    DataService,
    CommonUtilsService,
    PageLoaderService,
    AlertService,
    UserAuthService,
    TitleService,  
    VehicleService,   
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },   
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiIntercepter, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
