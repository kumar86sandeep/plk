import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import Swal from 'sweetalert2'

import { DataService, CommonUtilsService, TitleService, VehicleService } from '../../core/services/index'
import { environment } from '../../../environments/environment'

declare var $;

@Component({
  selector: 'app-still-cut',
  templateUrl: './still-cut.component.html',
  styleUrls: ['./still-cut.component.css']
})
export class StillCutComponent implements OnInit {
  @ViewChild("stillcutImagesSection",{static: false}) stillcutImagesSection: ElementRef;
 
  stillcutListing:any = []  
  deviceId:any;
  images:any = []
  stillObj:any = {}
  hasMorePages:boolean = false;
  paginate = {  
    limit: 10,   
    offset:1,
    deviceId:''
  }
  deviceAddress:string;
  // google maps zoom level
  zoom: number = 10;
  vehicles:any; //fromdb
  vehicle:any;
  totalVehicles:any;
  deviceMarkers:any; //from cloud server
  lat:any;
  lng:any;
  constructor(private vehicleService:VehicleService, private dataService:DataService, private activatedRoute: ActivatedRoute, private location:Location, private titleService:TitleService, private commonUtilsService:CommonUtilsService) {
    this.deviceId  =  this.activatedRoute.snapshot.params.deviceId
    this.paginate.deviceId = this.deviceId ;
    this.fetchDevices();
   }

  ngOnInit() {
    this.titleService.setTitle();
    this.fetchResults();
    // this.fetchVehicleDetails();
    
  }

  goBack(){
    this.location.back();
   }

   applyPagination(type){   
    
    if(type=="prev"){
      this.paginate.offset = (this.paginate.offset)-1      
    }else if(type=="next"){    
      this.paginate.offset = (this.paginate.offset)+1     
    }  
    this.fetchResults();
 
  }

  // private fetchVehicleDetails():void{
  //     this.vehicleService.getVehicle(this.deviceId).subscribe(response=>{
  //      this.vehicle = response;
  //     },error=>{

  //     })
  // }

  fetchResults(){
    
    this.commonUtilsService.showPageLoader(environment.MESSAGES.FETCHING_RECORDS); 
    this.dataService.listingDeviceStillCut(this.paginate).subscribe(response => {

      response = (response == null)?[]:response
      this.hasMorePages = true
      if(response.length<=0){
        this.hasMorePages = false        
      }
      this.stillcutListing = response
      this.commonUtilsService.hidePageLoader(); 

    }, error => {
      this.commonUtilsService.onError(error);
    })

  }

   stillcutImage(stillObj){
    this.commonUtilsService.showPageLoader(environment.MESSAGES.FETCHING_IMAGES); 
      this.stillObj = stillObj
      this.dataService.stillcutImage(stillObj).subscribe(response => {        
        console.log('response',response);
        this.images = response
        this.commonUtilsService.hidePageLoader();  
        $(this.stillcutImagesSection.nativeElement).modal({backdrop: 'static', keyboard: false, show: true});
         
           
      }, error => {
        this.commonUtilsService.onError(error);
      })
   }

   requestEvent(){   

    Swal.fire({
      title: 'Are you sure to request this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        
      }
    })
   }

   formatCutlistDatetime(cutlistObject){
    let lastKey = String(cutlistObject.lastKey)  
    let jpgTime = String(cutlistObject.jpgTime)   
    return `${lastKey.substring(0,4)}-${lastKey.substring(4,6)}-${lastKey.substring(6,8)} ${lastKey.substring(8,10)}:${jpgTime.substring(0,2)}` 
   }

   // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
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
  this.vehicleService.getVehicles().subscribe(response => {
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
      // this.router.navigate(['/home/listing'])
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
