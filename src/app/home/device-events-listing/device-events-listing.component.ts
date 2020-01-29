import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

import { DataService, CommonUtilsService, TitleService, VehicleService } from '../../core/services/index'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-device-events-listing',
  templateUrl: './device-events-listing.component.html',
  styleUrls: ['./device-events-listing.component.css']
})
export class DeviceEventsListingComponent implements OnInit {

  eventMapping:any = {
    DCA_EVENT_TYPE_Gsensor : 'Gsensor',
    DCA_EVENT_TYPE_GSensor_Light : 'Gsensor Light',
    DCA_EVENT_TYPE_Panic : 'Panic',
    DCA_EVENT_TYPE_OnDemand: 'On Demand',
  }
  eventListing:any = []  
  deviceId:any = '';
  hasMorePages:boolean = false;
  eventsDateSearchForm: FormGroup;
  eventsDate: any;
  vehicle:any
  paginate = {  
    limit: 10,   
    offset:1,
    deviceId:''
  }
  deviceAddress:string;
  // google maps zoom level
  zoom: number = 10;
  vehicles:any; //fromdb
  totalVehicles:any;
  deviceMarkers:any; //from cloud server
  lat:any;
  lng:any;
  company_id:any;
  constructor(private vehicleService:VehicleService, private router: Router, private dataService:DataService, private activatedRoute: ActivatedRoute, private location:Location, private titleService:TitleService, private commonUtilsService:CommonUtilsService, private calendar: NgbCalendar, private formBuilder: FormBuilder,) { 
    this.deviceId = this.activatedRoute.snapshot.params.deviceId     
    this.eventsDate = this.calendar.getToday();
    this.titleService.setTitle();    
    this.paginate.deviceId = this.deviceId 

    this.eventsDateSearchForm = this.formBuilder.group({
      eventsSearchDate: [this.eventsDate]     
    });
    let company = JSON.parse(localStorage.getItem('user'));
    this.company_id = company._id;
     this.fetchDevices()
    this.fetchResults()  ;
  }

  ngOnInit() { 
    
  }
  





  
  requestEvent(filename){   
    console.log('filename',filename);
    Swal.fire({
      title: 'Do you want to request the light event video?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var formData: any = new FormData();
        let newfilename = filename.slice(0, -4)
       
        formData.append("parameter", `"{currentVideo:${newfilename}}"`);

        
        this.commonUtilsService.showPageLoader('Processing...'); 
          this.dataService.gensorLightVideoRequest(formData, this.deviceId).subscribe(response => {
            
            this.commonUtilsService.hidePageLoader(); 
            Swal.fire(
              'Done!',
              'Your request has been processed. The light event video should momentarily available in Dash Cam Event Page.',
              'success'
            )
            //this.commonUtilsService.onSuccess("Your request has been sent successfully.")
          }, error => {
            this.commonUtilsService.onError(error);
          })
      }
    })
   }

  onSelectDate(event: any): void {    
    this.eventsDate = {
      year:event.year, month:event.month, day:event.day
    };

    this.fetchResults()
  }

  goBack(){
    this.location.back();
  }

 
  eventVideos(obj){
    console.log(obj);
    if(obj.encodedFiles== null){
      alert('no attached files');
      return false;
    }
   let filekey = btoa(obj.filekey)
    filekey = btoa(filekey)
    this.router.navigate(['/home/event-videos/'+filekey+'/'+this.deviceId])
  }

  /*applyPagination(type){   
    
    if(type=="prev"){
      this.paginate.offset = (this.paginate.offset)-1      
    }else if(type=="next"){    
      this.paginate.offset = (this.paginate.offset)+1     
    }  
    this.fetchResults();
  }*/

  fetchResults(){
    this.commonUtilsService.showPageLoader(environment.MESSAGES.FETCHING_RECORDS); 
    this.dataService.listingDeviceEvents({deviceId:this.deviceId, eventsDate: this.eventsDate }).subscribe(response => {
      //console.log('response',response);
      
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
     // console.log(eventType);
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
  fetchDevices(){
    this.commonUtilsService.showPageLoader(); 
   
    this.dataService.listingDevices().subscribe(response => {     
    this.deviceMarkers = response        
    this.getVehicles();
    this.commonUtilsService.hidePageLoader();     
  }, error => {
    this.commonUtilsService.onError(error);
  })
}



/*
fetch all vehicles from the db
*/


private getVehicles(): void {
  this.vehicleService.getVehicles(this.company_id).subscribe(response => {
    this.vehicles = response.vehicles;
    this.totalVehicles = response.totalRecords;

    this.vehicles.forEach((vehilce) => {
      this.deviceMarkers.forEach(device => {
        if (device.devices_NO == vehilce.device_id) {
          vehilce['deviceInfo'] = device;

        }

      });

    });
    // this.originalVehicleListing = this.vehicles;
 
    const index  = this.vehicles.map(e => e.deviceInfo.devices_NO).indexOf(this.deviceId); 

    if(index == -1){
      this.commonUtilsService.onError('Sorry!! Could not found device.');
      this.router.navigate(['/home/listing'])
      return;
    }
    this.vehicle = this.vehicles[index];
    console.log('the vehicle after filter is',this.vehicle)
    this.vehicles[index]['isOpen'] = true   
    this.lat = (this.vehicles[index]['deviceInfo']['latitude']==0)?this.lat:this.vehicles[index]['deviceInfo']['latitude']
    this.lng = (this.vehicles[index]['deviceInfo']['longitude']==0)?this.lng:this.vehicles[index]['deviceInfo']['longitude']
    this.fetchDeviceAddress(this.vehicles[index]['deviceInfo']);






  }, error => {

  })
}
fetchDeviceAddress(marker){
  console.log('marker',marker)
  let geoCoder = new google.maps.Geocoder;
  geoCoder.geocode({ 'location': { lat: marker.latitude, lng: marker.longitude } }, (results, status) => {
   
    if (status === 'OK') {
      if (results[0]) {
        this.zoom = 12;
        this.deviceAddress = results[0].formatted_address;
       // this.commonUtilsService.onSuccess("Your dealerhsip plan has been cancelled successfully.")
      } else {
        //window.alert('No results found');
        this.commonUtilsService.onError('Could not find the address.');
      }
    } else {
    //  window.alert('Geocoder failed due to: ' + status);
      this.commonUtilsService.onError('Geocoder failed due to: ' + status);
    }

  });
}

}
