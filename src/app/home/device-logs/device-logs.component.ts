import { Component, OnInit, NgZone } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { DataService, CommonUtilsService, UserAuthService, TitleService } from '../../core/services/index'



@Component({
  selector: 'app-device-logs',
  templateUrl: './device-logs.component.html',
  styleUrls: ['./device-logs.component.css']
})
export class DeviceLogsComponent implements OnInit { 
 
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
  deviceId: string;

  constructor(private dataService:DataService, private activatedRoute: ActivatedRoute, private userAuthService:UserAuthService, private commonUtilsService:CommonUtilsService, private titleService:TitleService, private router: Router, private calendar: NgbCalendar, private formBuilder: FormBuilder, private ngZone: NgZone, private location:Location) { 
    this.userAuthService.isLoggedIn(true);//trigger loggedin observable 
    if(!this.activatedRoute.snapshot.params.deviceId){
      this.router.navigate(['/home/listing'])
    }
    this.deviceId = this.activatedRoute.snapshot.params.deviceId     
  }

  async ngOnInit() {      
    this.titleService.setTitle();  
    await this.fetchDevices()   

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
      this.lat = (this.deviceMarkers[index]['latitude']==0)?this.lat:this.deviceMarkers[index]['latitude']
      this.lng = (this.deviceMarkers[index]['longitude']==0)?this.lng:this.deviceMarkers[index]['longitude']
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
  }

 clickedMarker(infowindow) {
  if (this.previousInfoWindow) {
      this.previousInfoWindow.close();
  }
  this.previousInfoWindow = infowindow;
}

goBack(){  
  this.location.back();
}


}
