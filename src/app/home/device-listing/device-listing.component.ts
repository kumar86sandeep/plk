import { Component, OnInit, NgZone, Renderer } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';

import { DataService, CommonUtilsService, UserAuthService, TitleService, VehicleService } from '../../core/services'

//shared services
import { PageLoaderService } from '../../core/shared/_services'

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
  vehicles: any;
  totalVehicles: number = 0;
  constructor(private render:Renderer,private vehicleService: VehicleService, private dataService: DataService, private ngZone: NgZone, private pageLoaderService: PageLoaderService, private commonUtilsService: CommonUtilsService, private userAuthService: UserAuthService, private titleService: TitleService) {

  }

  ngOnInit() {
    this.titleService.setTitle();
    this.commonUtilsService.showPageLoader();
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
      this.originalVehicleListing = this.vehicles;

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
      return (vehicle.vehicle_no.includes(event.target.value) || vehicle.vehicle_year.includes(event.target.value) || vehicle.vehicle_modal.includes(event.target.value) || vehicle.vehicle_vin.includes(event.target.value))
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

}
