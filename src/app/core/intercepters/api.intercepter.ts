import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';


@Injectable()
export class ApiIntercepter implements HttpInterceptor {

  
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let apiReq = request.clone({ url: `${request.url}` });
   
    if (!(request.url).includes('fmsweb')) {      
      apiReq = request.clone({ url: environment.DB_CONNECTION_URL+`${request.url}` });      
    }
    
    //console.log('apiReq',apiReq);
    return next.handle(apiReq);

  }


}
