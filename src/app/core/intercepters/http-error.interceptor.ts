import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from "@angular/router";
import { retry, catchError } from 'rxjs/operators';
import { UserAuthService } from '../services'

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                    } else {
                        // server-side error
                        errorMessage = error.error
                    }
                  
                    let redirectUrl = '';
                    console.log('errorMessage',errorMessage);
                    if (errorMessage == 'Invalid token' || errorMessage  == 'Access denied. No token provided.') {                        

                        localStorage.removeItem('loggedinUser');
                        localStorage.clear();                       
                        this.router.navigate(['/' + redirectUrl + '/login']);
                    }
                    return throwError(errorMessage);
                })
            )
    }
}