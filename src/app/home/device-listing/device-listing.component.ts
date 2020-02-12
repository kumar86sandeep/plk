import { Component, OnInit, NgZone, Renderer } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';

import { DataService, CommonUtilsService, UserAuthService, TitleService, VehicleService } from '../../core/services'

//shared services
import { PageLoaderService } from '../../core/shared/_services'
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-listing',
  templateUrl: './device-listing.component.html',
  styleUrls: ['./device-listing.component.css']
})

export class DeviceListingComponent implements OnInit {

  

  // google maps zoom level
  zoom: number = 10;
  selectedIndex:number = 0;
  // initial center position for the map
  lat: number = 33.859337;
  lng: number = -117.91992;
  locatorIconActive: string = "/assets/images/icon-blue.png"
  locatorIconInactive: string = "/assets/images/icon-red.png"
  deviceListing: any = []
  deviceMarkers: any = []
  originalDeviceListing: any = [];
  originalVehicleListing: any = []
  previousInfoWindow: any;
  vehicles:any= [];
  totalVehicles: number = 0;
  company_id:any;
  constructor(private render:Renderer,private vehicleService: VehicleService, private dataService: DataService, private ngZone: NgZone, private pageLoaderService: PageLoaderService, private commonUtilsService: CommonUtilsService, private userAuthService: UserAuthService, private titleService: TitleService,private router:Router) {

  }

  ngOnInit() {
    this.titleService.setTitle();
    this.commonUtilsService.showPageLoader();
    let company = JSON.parse(localStorage.getItem('user'));
    this.company_id = company._id;
    this.dataService.listingDevices().subscribe(response => {
      this.deviceMarkers = this.deviceListing = response
      this.originalDeviceListing = response
      this.getVehicles()
      this.commonUtilsService.hidePageLoader();
    }, error => {
      this.commonUtilsService.onError(error);
    });

  }

  private getVehicles(): void {
    this.vehicleService.getVehicles(this.company_id).subscribe(response => {
      this.vehicles = response.vehicles;
      this.totalVehicles = response.totalRecords;

      this.vehicles.forEach((vehilce) => {
        this.deviceMarkers.forEach(device => {
         // console.log('the aids are',device.devices_NO)
          if (device.devices_NO == vehilce.device_id) {
            
            vehilce['deviceInfo'] = device;

          }

        });

      });
      console.log('vehicles',this.vehicles);
      this.originalVehicleListing = this.vehicles;
     // console.log('the listng is',this.vehicles)
    }, error => {

    })
  }


  //this is for search vehicle from db
  filterVehicles(event) {
    // this.deviceMarkers = this.deviceListing = this.originalDeviceListing
   if(event.target.value){
    let eventValue = event.target.value


    //filter vehicle array on front end
    var newArray = this.vehicles.filter( (vehicle)=> {
      //console.log('vehicle',vehicle);
      return (vehicle.device_id.includes(event.target.value) || vehicle.vehicle_no.includes(event.target.value) || vehicle.vehicle_year.includes(event.target.value) || vehicle.vehicle_modal.includes(event.target.value) || vehicle.vehicle_vin.includes(event.target.value))
    });
    this.vehicles = newArray;  
   }else{
    this.vehicles = this.originalVehicleListing
   }
   

  }


  /*
 	Active class on click of device 
  */
  activateClass(vehicle, i) {
    this.selectedIndex = i;
    
  }

  clickedMarker(infowindow) {
    if (this.previousInfoWindow) {
      this.previousInfoWindow.close();
    }
    this.previousInfoWindow = infowindow;
  }

  public redirectToDeviceLogs(vehicle:any):void{
    //console.log('the device is is',vehicle.deviceInfo)
    if(vehicle.deviceInfo){
   
     this.router.navigate(['/home/device-logs/'+vehicle.deviceInfo.devices_NO])
    }else{
      this.commonUtilsService.onError('Oops! device not found.')
    }
    

  }

}
