import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { UserAuthService, CommonUtilsService } from '../../../services'
import { environment } from 'src/environments/environment';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  idleState = 'Not started.';
  timedOut = false;
  companyLogo:any;
  lastPing?: Date = null;
  isLoggedin:boolean = false;
  loggedinUserObject:any;
  constructor(private userAuthService:UserAuthService, private router: Router, private commonUtilsService:CommonUtilsService, private bnIdle: BnNgIdleService) {   
    
    this.userAuthService.checkLoggedinStatus().subscribe((loginStatus) => {
     console.log('loginStatus',loginStatus);
      this.isLoggedin = loginStatus.isLoggedIn;   
      this.loggedinUserObject = JSON.parse(localStorage.getItem('user'))  
      console.log('loggedinUserObject',this.loggedinUserObject);
      this.companyLogo = (this.loggedinUserObject)?this.loggedinUserObject.logo_url:'';
      //this.fetchUser();      
    });
  }    

  

  ngOnInit() {

    this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
     // console.log('isTimedOut',isTimedOut);
      if (isTimedOut && localStorage.getItem('x-auth-token')){
       // console.log('session expired');
         this.logoutDueToInactive()
      }
    });


    if (localStorage.getItem('x-auth-token')) {
      this.isLoggedin = true
      //this.fetchUser()
      this.loggedinUserObject = JSON.parse(localStorage.getItem('user'))  
      this.companyLogo = this.loggedinUserObject.logo_url;
    }
  }

  fetchUser(){
   /*this.userAuthService.fetchUser().subscribe((response) => {        
       this.loggedinUserObject =   response
       
     });*/
    this.loggedinUserObject = JSON.parse(localStorage.getItem('user'))
    console.log('loggedinUserObject',this.loggedinUserObject);
    this.companyLogo = this.loggedinUserObject.logo_url;
    //console.log('companyLogo',this.companyLogo);
  }
  logoutDueToInactive(){
    this.commonUtilsService.showPageLoader(environment.MESSAGES.LOGOUT_IN_PROCESS);     
    localStorage.removeItem('x-auth-token');
    localStorage.clear();
    this.commonUtilsService.onError(environment.MESSAGES.INACTIVE_LOGOUT_SUCCESS);
    this.userAuthService.isLoggedIn(false);
    this.commonUtilsService.hidePageLoader(); 
    this.router.navigate(['/login']);
    return false;
  }
  logout() {   
    this.commonUtilsService.showPageLoader(environment.MESSAGES.LOGOUT_IN_PROCESS);     
    localStorage.removeItem('x-auth-token');
    localStorage.clear();
    this.commonUtilsService.onSuccess(environment.MESSAGES.LOGOUT_SUCCESS);
    this.userAuthService.isLoggedIn(false);
    this.commonUtilsService.hidePageLoader(); 
    this.router.navigate(['/login']);
    return false;
  }

}
