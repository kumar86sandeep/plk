import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class DataService {


    constructor(private httpClient: HttpClient) { }

    /**
     * List seller's car
     * @param page    passed object of Page.
     * @return        Observable<PagedData<Car>>
    */

    public listingDevices(): Observable<any> {      
       
        return this.httpClient.get(`${environment.PLKCONFIG.URL}device/list?tenanatId=${environment.PLKCONFIG.TENANATID}&SecretToken=${environment.PLKCONFIG.SECRETTOKEN}&pageNum=1&pageSize=200000`)
            
    }   

    public listingDeviceLogs(searchObject): Observable<any> {         
        
        const dateObj = searchObject.date
        console.log('dateObj',dateObj);       
        return this.httpClient.get(`${environment.PLKCONFIG.URL}device/log?tenanatId=${environment.PLKCONFIG.TENANATID}&SecretToken=${environment.PLKCONFIG.SECRETTOKEN}&serialNumber=${searchObject.serialNumber}&date=${dateObj['day']}&month=${dateObj['month']}&year=${dateObj['year']}`)
        //http://fmsweb.plkconnected.com/device/log?tenanatId=50e86645-6918-4173-ab3f-2e2271cd7050&SecretToken=87WAYS7NR4X181CEBIURUXPK&serialNumber=PB01B60016&date=5&month=11&year=2019
            
    }

    public listingDeviceEvents(paginate): Observable<any> { 
         
        console.log(paginate)
        return this.httpClient.get(`${environment.PLKCONFIG.URL}video/event?tenanatId=${environment.PLKCONFIG.TENANATID}&SecretToken=${environment.PLKCONFIG.SECRETTOKEN}&serialNumber=${paginate.deviceId}&pageNum=${paginate.offset}&pageSize=${environment.PAGESIZE}`)
            
    }

    public listingEventVideos(filekey): Observable<any> {     
        console.log('filekey',filekey);

        return this.httpClient.get(`${environment.PLKCONFIG.URL}rec/${filekey}`)
            
    }
    public listingDeviceStillCut(paginateObject): Observable<any> {     
        

        return this.httpClient.get(`${environment.PLKCONFIG.URL}video/stillcut/list?tenanatId=${environment.PLKCONFIG.TENANATID}&SecretToken=${environment.PLKCONFIG.SECRETTOKEN}&serialNumber=${paginateObject.deviceId}&pageNum=${paginateObject.offset}&pageSize=${environment.PAGESIZE}`)
            
    }

    public stillcutImage(stillcutObject): Observable<any> {       

        return this.httpClient.get(`${environment.PLKCONFIG.URL}video/stillcut?tenanatId=${environment.PLKCONFIG.TENANATID}&SecretToken=${environment.PLKCONFIG.SECRETTOKEN}&serialNumber=${stillcutObject.serialNumber}&lastKey=${stillcutObject.lastKey}&jpgTime=${stillcutObject.jpgTime}`)      
            
    }

    

}
