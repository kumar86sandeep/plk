import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';

//import shared services
import { PageLoaderService } from '../shared/_services'
import { environment } from '../../../environments/environment'

@Injectable()
export class CommonUtilsService {
  currentYear: number = new Date().getFullYear();   // get Current Year

  constructor(private httpClient: HttpClient, private pageLoaderService: PageLoaderService, public toastrManager: ToastrManager) { }

  /**
  * Show page loder on fetching data
  * @return void
  */
  public showPageLoader(message = environment.MESSAGES.FETCHING_RECORDS):void{
    this.pageLoaderService.setLoaderText(message);//setting loader text
    this.pageLoaderService.pageLoader(true);//show page loader
  }

  /**
  * Hide page loder on fetching data
  * @return void
  */
  public hidePageLoader(): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text
  }

  /**
  * Show alert on success response & hide page loader
  * @return void
  */
  public onSuccess(message): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text empty
    this.toastrManager.successToastr(message, 'Success!'); //showing success toaster 
  }

  /**
  * Show alert on error response & hide page loader
  * @return void
  */
  public onError(message): void {
    this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.toastrManager.errorToastr(message, 'Oops!',{maxShown:1});//showing error toaster message  
  }
}
