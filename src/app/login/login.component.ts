import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { untilDestroyed } from 'ngx-take-until-destroy';


import { UserAuthService, CommonUtilsService, TitleService } from '../core/services/index'
import { environment } from 'src/environments/environment';
import { AuthService } from "angularx-social-login";
import { SocialLoginModule, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SocialLoginModule,AuthService]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private titleService:TitleService, private userAuthService:UserAuthService, private formBuilder: FormBuilder, private router: Router, private commonUtilsService:CommonUtilsService, private socialAuthService: AuthService) { 
    
    if (localStorage.getItem("x-auth-token")) {
      // logged in so return true
      this.router.navigate(['/home/listing'])
    }  
       
  }

  ngOnInit() {
    /*this.socialAuthService.authState.subscribe((user) => {
      this.addUser(user);   
    });*/

    this.titleService.setTitle();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: [null, [Validators.required,Validators.minLength(10), Validators.maxLength(50)]],
      remember_me:[null]     
    });

  }

  //check login at our local system
  onSubmit() {
    
    if(this.loginForm.invalid){
      return false;
    }
    this.commonUtilsService.showPageLoader(environment.MESSAGES.CHEKING_AUTH); 
    this.userAuthService.login(this.loginForm.value)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => { 
          localStorage.setItem("x-auth-token", response.headers.get('x-auth-token'));       
          this.commonUtilsService.hidePageLoader(); 
          this.userAuthService.isLoggedIn(true);//trigger loggedin observable 
          this.router.navigate(['/home/listing'])
        },
        error => {
          //showing error toaster message
          console.log('error',error);
          this.commonUtilsService.onError(error);
        });
  }

  
  //social logins methods
  signInWithGoogle(): void {
    let self = this;
      let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
      this.socialAuthService.signIn(socialPlatformProvider).then(
        (userData:any) => {
          console.log('userData',userData);
          this.addUser(userData);        
              
        }
      );
     
    }

  addUser(userData){
    this.commonUtilsService.showPageLoader(environment.MESSAGES.CHEKING_AUTH); 
          this.userAuthService.saveUser(userData)
            .pipe(untilDestroyed(this))
            .subscribe(
              (response) => { 
                localStorage.setItem("x-auth-token", response.headers.get('x-auth-token'))         
                this.commonUtilsService.hidePageLoader(); 
                this.userAuthService.isLoggedIn(true);//trigger loggedin observable 
                this.router.navigate(['/home/listing'])
              },
              error => {
                //showing error toaster message
                console.log('no');
                this.commonUtilsService.onError(error);
              });
  }

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }

}
