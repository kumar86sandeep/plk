import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class VehicleService {


    constructor(private httpClient: HttpClient) { }

  

 

 // apis to get data from server
    public getVehicles():Observable<any>{
        return this.httpClient.get('/plk/vehicles');
    }
    // apis to get data from server
    public getVehicle(deviceId:any):Observable<any>{
        return this.httpClient.get('/plk/vehicle/'+deviceId);
    }

}
