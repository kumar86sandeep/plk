import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})

export class UserAuthService {
 
  public loggedIn: Subject<any> = new Subject<any>();


  constructor(private httpClient: HttpClient) { }

  isLoggedIn(value: boolean) {
    console.log('isloddein',value);
    this.loggedIn.next({ isLoggedIn: value });
  }
  checkLoggedinStatus(): Observable<any> {
    return this.loggedIn.asObservable();
  }

  
  login(postedData): Observable<any> {
    return this.httpClient
      .post('auth/login', postedData, { observe: 'response' })
      .map((response: any) => {        
        return response;
      })

  }

  saveUser(socialLoginData): Observable<any> {
    
    return this.httpClient
      .post('addUser', socialLoginData, { observe: 'response' })
      .map((response: any) => {        
        return response;
      })

  }

  fetchUser(): Observable<any> {
    let authToken = localStorage.getItem('x-auth-token')
    return this.httpClient
      .post('auth/fetchUser', {authToken})
      .map((response: any) => {        
        return response;
      })

  }

}