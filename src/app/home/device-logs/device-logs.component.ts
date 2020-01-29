import { Component, OnInit, NgZone } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { DataService, CommonUtilsService, UserAuthService, TitleService, VehicleService } from '../../core/services/index'



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
  vehicle:any;
  totalVehicles:number = 0;
  vehicles:any;
  company_id:any;
  constructor(private vehicleService:VehicleService, private dataService:DataService, private activatedRoute: ActivatedRoute, private userAuthService:UserAuthService, private commonUtilsService:CommonUtilsService, private titleService:TitleService, private router: Router, private calendar: NgbCalendar, private formBuilder: FormBuilder, private ngZone: NgZone, private location:Location) { 
    this.userAuthService.isLoggedIn(true);//trigger loggedin observable 
    if(!this.activatedRoute.snapshot.params.deviceId){
      this.router.navigate(['/home/listing'])
    }
    this.deviceId = this.activatedRoute.snapshot.params.deviceId   
    this.titleService.setTitle();  
    let company = JSON.parse(localStorage.getItem('user'));
    this.company_id = company._id;
     this.fetchDevices()     
  }

  async ngOnInit() {      
    

  }
  
  fetchDeviceAddress(marker){
    // console.log('marker',marker)
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
          // console.log('the vehicle',device.devices_NO ,'and device is is',vehilce.device_id)
          if(device.devices_NO){
            // console.log('the vehicle',device.devices_NO ,'and device is is',vehilce.device_id)
          if (device.devices_NO.toString() == vehilce.device_id) {
            // console.log('the vehicsssle',device.devices_NO)
            vehilce['deviceInfo'] = device;

          }
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
