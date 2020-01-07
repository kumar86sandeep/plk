import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
//modules core services
import { UserAuthService } from '../services'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private userAuthService: UserAuthService, private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  
    if (localStorage.getItem("x-auth-token")) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    localStorage.clear();
    this.userAuthService.isLoggedIn(false);
    this.router.navigate(['/login']);
    return false;
  }
}
