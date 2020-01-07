import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { UserAuthService, CommonUtilsService } from '../../../services'
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 
  isLoggedin:boolean = false;
  loggedinUserObject:any;
  constructor(private userAuthService:UserAuthService, private router: Router, private commonUtilsService:CommonUtilsService) {
    this.userAuthService.checkLoggedinStatus().subscribe((loginStatus) => {
      this.isLoggedin = loginStatus.isLoggedIn;   
      this.fetchUser();
      
    });
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
