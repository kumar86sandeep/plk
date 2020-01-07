import { Component, OnInit, NgZone } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';


import { DataService, CommonUtilsService, UserAuthService, TitleService } from '../../core/services/index'



interface Log {
	ldState: any;
	ldwState: any;
	vdState: any;
  pdState: any;
  tsrState: any;
  tsrWarning: any;
  event: any;
  dsmState: any;
  dsmWarning: any;
  tasWarning: any;
  rearPDState: any;
  lat: any;
  lng: any;
}

@Component({
  selector: 'app-device-logs',
  templateUrl: './device-logs.component.html',
  styleUrls: ['./device-logs.component.css']
})
export class DeviceLogsComponent implements OnInit {
  
  logsCount:any={
    ldState: 0,
    ldwState:0,
    vdState: 0,
    pdState: 0,
    tsrState: 0,
    tsrWarning: 0,
    event: 0,
    dsmState: 0,
    dsmWarning: 0,
    tasWarning: 0,
    rearPDState: 0,
    lat: 0,
    lng: 0
  };
  deviceId:any;
  logsDate: any;
  logsDateSearchForm: FormGroup;
  deviceMarkers:any = []
  deviceAddress:string;
  // google maps zoom level
  zoom: number = 10;  
  // initial center position for the map
  lat: number = 33.859337;
  lng: number = -117.91992;
  locatorIconActive:string = "/assets/images/icon-blue.png"
  locatorIconInactive:string = "/assets/images/icon-red.png"
  previousInfoWindow:any;

  constructor(private dataService:DataService, private activatedRoute: ActivatedRoute, private location:Location, private userAuthService:UserAuthService, private commonUtilsService:CommonUtilsService, private titleService:TitleService, private router: Router, private calendar: NgbCalendar, private formBuilder: FormBuilder, private ngZone: NgZone) { 
    this.userAuthService.isLoggedIn(true);//trigger loggedin observable 
    if(!this.activatedRoute.snapshot.params.deviceId){
      this.router.navigate(['/home/listing'])
    }
    this.deviceId = this.activatedRoute.snapshot.params.deviceId 
    this.logsDate = this.calendar.getToday();
  }

  async ngOnInit() {      
    this.titleService.setTitle();
    this.logsDateSearchForm = this.formBuilder.group({
      logSearchDate: [this.logsDate]     
    });

    await this.fetchDevices()
    await this.fetchDeviceLogs()     
  }

  onSelectDate(event: any): void {    
    this.logsDate = {
      year:event.year, month:event.month, day:event.day
    }
    this.fetchDeviceLogs()
  }
  fetchDeviceAddress(marker){
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

  
  fetchDeviceLogs(){
    let searchLogObject = {
      date:this.logsDate,
      serialNumber:this.deviceId
    }
    this.commonUtilsService.showPageLoader(); 
    this.dataService.listingDeviceLogs(searchLogObject).subscribe(response => {
        this.logsCount = {
          ldwLState:0,
          ldwRState:0,
          vdState:0,
          pdState:0

        }
        if(response != null && response.length>0){
          
          this.ngZone.run( () => {
            //calculating ldwState count
            let ldwLeftStateLogs = response.filter((log) => (log.ldwState == 1)).map((log) => log);          
            //this.logsCount['ldwState'] = ldwLeftStateLogs.length;

            let ldwRightStateLogs = response.filter((log) => (log.ldwState == 2)).map((log) => log);          
            this.logsCount['ldwLState'] = ldwLeftStateLogs.length;
            this.logsCount['ldwRState'] = ldwRightStateLogs.length; 

           });

                  
        }      
          
        console.log(this.logsCount);
        this.commonUtilsService.hidePageLoader();
     }, error => {
        this.commonUtilsService.onError(error);
     }) 
  }

  fetchDevices(){
      this.commonUtilsService.showPageLoader(); 
     
      this.dataService.listingDevices().subscribe(response => {     
      this.deviceMarkers = response        
      const index  = this.deviceMarkers.map(e => e.devices_NO).indexOf(this.deviceId); 
  
      if(index == -1){
        this.commonUtilsService.onError('Sorry!! Could not found device.');
        this.router.navigate(['/home/listing'])
        return;
      }
      this.deviceMarkers[index]['isOpen'] = true   
      console.log('deviceMarkers',this.deviceMarkers);  
      this.lat = this.deviceMarkers[index]['latitude'] 
      this.lng = this.deviceMarkers[index]['longitude'] 
      this.fetchDeviceAddress(this.deviceMarkers[index]);
      this.commonUtilsService.hidePageLoader();     
    }, error => {
      this.commonUtilsService.onError(error);
    })
  }

  clickedInfoWindow(marker) { 
    this.deviceId = marker.devices_NO   
    const index  = this.deviceMarkers.map(e => e.devices_NO).indexOf(marker.devices_NO); 
    this.deviceMarkers[index]['isOpen'] = true 
    this.lat = this.deviceMarkers[index]['latitude'] 
    this.lng = this.deviceMarkers[index]['longitude']  
    this.fetchDeviceAddress(marker);
    this.fetchDeviceLogs()
  }



 goBack(){
  this.location.back();
 }

 clickedMarker(infowindow) {
  if (this.previousInfoWindow) {
      this.previousInfoWindow.close();
  }
  this.previousInfoWindow = infowindow;
}


}
