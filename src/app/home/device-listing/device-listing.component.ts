import { Component, OnInit, NgZone } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';

import { DataService, CommonUtilsService, UserAuthService, TitleService ,VehicleService} from '../../core/services'

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
  
  // initial center position for the map
  lat: number = 33.859337;
  lng: number = -117.91992;
  locatorIconActive:string = "/assets/images/icon-blue.png"
  locatorIconInactive:string = "/assets/images/icon-red.png"
  deviceListing:any = []
  deviceMarkers:any = []
  originalDeviceListing:any = []
  previousInfoWindow:any;

  constructor(private vehicleService:VehicleService, private dataService:DataService, private ngZone: NgZone, private pageLoaderService: PageLoaderService, private commonUtilsService:CommonUtilsService, private userAuthService:UserAuthService, private titleService:TitleService) {	
	
  }

  ngOnInit() {
	this.titleService.setTitle();
	this.commonUtilsService.showPageLoader();
    this.dataService.listingDevices().subscribe(response => {
		this.deviceMarkers = this.deviceListing = response
		this.originalDeviceListing = response
		this.commonUtilsService.hidePageLoader();
    }, error => {
		this.commonUtilsService.onError(error);
    });
    this.vehicleService.getVehicles().subscribe(response=>{
        console.log('the vehicle is ',response)
    },error=>{

    })
  }

 
  filterVehicles(event){
	this.deviceMarkers = this.deviceListing = this.originalDeviceListing
	let eventValue = event.target.value
	let data =  this.deviceListing.filter(o =>
		Object.keys(o).some(k => o['devices_NO'].toLowerCase().includes(eventValue.toLowerCase())));
		this.ngZone.run( () => {
			this.deviceListing = data
			this.deviceMarkers = data
			console.log('data',data);
			return this.deviceListing;
		 });
		
  }


  /*
 	Active class on click of device 
  */
 activateClass(device,i){
	//this.zoom = 10
	this.originalDeviceListing.map(function(x) { 
		x.isOpen = false; 
		x.active = false; 
		return x
	});

	device.active = !device.active; 
	device.isOpen = true
 }

 clickedMarker(infowindow) {
    if (this.previousInfoWindow) {
        this.previousInfoWindow.close();
    }
    this.previousInfoWindow = infowindow;
 }

}
