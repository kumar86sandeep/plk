import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

import { DataService, CommonUtilsService, TitleService } from '../../core/services/index'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-device-events-listing',
  templateUrl: './device-events-listing.component.html',
  styleUrls: ['./device-events-listing.component.css']
})
export class DeviceEventsListingComponent implements OnInit {

  eventMapping:any = {
    DCA_EVENT_TYPE_Gsensor : 'Gsensor',
    DCA_EVENT_TYPE_Gsensor_Light : 'Gsensor Light',
    DCA_EVENT_TYPE_Panic : 'Panic',
    DCA_EVENT_TYPE_OnDemand: 'On Demand',
  }
  eventListing:any = []  
  deviceId:any = '';
  hasMorePages:boolean = false;
  paginate = {  
    limit: 10,   
    offset:1,
    deviceId:''
  }
  constructor(private router: Router, private dataService:DataService, private activatedRoute: ActivatedRoute, private location:Location, private titleService:TitleService, private commonUtilsService:CommonUtilsService) { 
    this.deviceId = this.activatedRoute.snapshot.params.deviceId     
  }

  ngOnInit() { 
    this.titleService.setTitle();    
    this.paginate.deviceId = this.deviceId 
    this.fetchResults()
  }

  goBack(){
    this.location.back();
  }

 
  eventVideos(filekey){
    filekey = btoa(filekey)
    this.router.navigate(['/home/event-videos/'+filekey+'/'+this.deviceId])
  }

  applyPagination(type){   
    
    if(type=="prev"){
      this.paginate.offset = (this.paginate.offset)-1      
    }else if(type=="next"){    
      this.paginate.offset = (this.paginate.offset)+1     
    }  
    this.fetchResults();
  }

  fetchResults(){
    this.commonUtilsService.showPageLoader(environment.MESSAGES.FETCHING_RECORDS); 
    this.dataService.listingDeviceEvents(this.paginate).subscribe(response => {
      console.log('response',response);
      
      response = (response == null)?[]:response
      this.hasMorePages = true
      if(response.length<=0){
        this.hasMorePages = false        
      }    
      this.eventListing = response
      this.commonUtilsService.hidePageLoader();  
      //console.log(this.eventListing);
      
    }, error => {
      this.commonUtilsService.onError(error);
    })
  }

  mapEvent(eventType){
   
    if(this.eventMapping.hasOwnProperty(eventType)){
      console.log(eventType);
      return this.eventMapping[eventType]
    }
    return eventType;
  }


  formatEventDatetime(eventDatetimeString){
    eventDatetimeString = String(eventDatetimeString)    
    return `${eventDatetimeString.substring(0,4)}-${eventDatetimeString.substring(4,6)}-${eventDatetimeString.substring(6,8)} ${eventDatetimeString.substring(8,10)}:${eventDatetimeString.substring(10,12)}:${eventDatetimeString.substring(12,14)}`
  }

  downloadVideo(fileKey){
    fileKey = fileKey.replace("fmsvideo", "fmsvideoDownload");
    return `${environment.PLKCONFIG.URL}rec/${fileKey}`
  }


}
