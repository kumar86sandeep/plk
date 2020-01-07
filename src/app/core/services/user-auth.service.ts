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
    
    this.loggedIn.next({ isLoggedIn: value });
  }
  checkLoggedinStatus(): Observable<any> {
    return this.loggedIn.asObservable();
  }

  
  login(postedData): Observable<any> {
    
    return this.httpClient
      .post('http://52.52.35.177:3000/api/auth/login', postedData, { observe: 'response' })
      .map((response: any) => {        
        return response;
      })

  }

  saveUser(socialLoginData): Observable<any> {
    
    return this.httpClient
      .post('http://52.52.35.177:3000/api/auth/addUser', socialLoginData, { observe: 'response' })
      .map((response: any) => {        
        return response;
      })

  }

  fetchUser(): Observable<any> {
    let authToken = localStorage.getItem('x-auth-token')
    return this.httpClient
      .post('http://52.52.35.177:3000/api/auth/fetchUser', {authToken})
      .map((response: any) => {        
        return response;
      })

  }

}