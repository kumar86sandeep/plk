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
  lastPing?: Date = null;
  isLoggedin:boolean = false;
  loggedinUserObject:any;
  constructor(private userAuthService:UserAuthService, private router: Router, private commonUtilsService:CommonUtilsService, private bnIdle: BnNgIdleService) {   
    
    this.userAuthService.checkLoggedinStatus().subscribe((loginStatus) => {
      this.isLoggedin = loginStatus.isLoggedIn;      
      this.fetchUser();      
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
      this.fetchUser()
    }
  }

  fetchUser(){
    this.userAuthService.fetchUser().subscribe((response) => {        
      this.loggedinUserObject =   response
      console.log('loggedinUserObject',this.loggedinUserObject);
    });
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
