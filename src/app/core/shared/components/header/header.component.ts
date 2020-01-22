import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { UserAuthService, CommonUtilsService } from '../../../services'
import { environment } from 'src/environments/environment';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

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
  constructor(private userAuthService:UserAuthService, private router: Router, private commonUtilsService:CommonUtilsService, private idle: Idle, private keepalive: Keepalive) {
    this.userAuthService.checkLoggedinStatus().subscribe((loginStatus) => {
      this.isLoggedin = loginStatus.isLoggedIn;   
      this.fetchUser();

      idle.setTimeout(60);
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
      idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
      idle.onTimeout.subscribe(() => {
        this.idleState = 'Timed out!';
        if(localStorage.getItem('loggedinSellerUser') || localStorage.getItem('loggedinDealerUser') )
        this.logout()
        this.timedOut = true;
      });
      idle.onIdleStart.subscribe(() => {
        this.idleState = 'You\'ve gone idle!'
         console.log('You have gone idle')
      });
      idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');
  
      // sets the ping interval to 15 seconds
      keepalive.interval(15);
  
      keepalive.onPing.subscribe(() => this.lastPing = new Date());
  
      this.reset();
      
    });
  }    

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  ngOnInit() {
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
