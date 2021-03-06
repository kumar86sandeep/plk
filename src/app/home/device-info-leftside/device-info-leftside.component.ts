import { Component, OnInit, NgZone, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { DataService, CommonUtilsService } from '../../core/services/index'
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-device-info-leftside',
  templateUrl: './device-info-leftside.component.html',
  styleUrls: ['./device-info-leftside.component.css']
})
export class DeviceInfoLeftsideComponent implements OnInit {
  intervalId:any;
  logsCount:any = {
    ldwLState:0,
    ldwRState:0,
    sdaState:0,
    vcwState:0
  }
  logsDate: any;
  //deviceId:any;
  deviceAddress:string;
  logsDateSearchForm: FormGroup;
  @Input() vehicle:any;

  constructor(private dataService:DataService, private activatedRoute: ActivatedRoute, private location:Location, private commonUtilsService:CommonUtilsService, private router: Router, private calendar: NgbCalendar, private formBuilder: FormBuilder, private ngZone: NgZone) { 
    this.logsDate = this.calendar.getToday();
  }

  ngOnInit() {
    
  }

  ngOnChanges() {
    this.logsDateSearchForm = this.formBuilder.group({
      logSearchDate: [this.logsDate]     
    });
    console.log('the vehicle is',this.vehicle)
    if(this.vehicle){
      this.fetchDeviceLogs();
      if(localStorage.getItem('x-auth-token')){
        window.setInterval(() => this.fetchDeviceLogs(), 10000);
      }
      
      this.fetchDeviceAddress(this.vehicle.deviceInfo)
    }

    // changes.prop contains the old and the new value...
  } 

  onSelectDate(event: any): void {    
    this.logsDate = {
      year:event.year, month:event.month, day:event.day
    }
    this.fetchDeviceLogs();    
  }

  fetchDeviceAddress(marker){
    let geoCoder = new google.maps.Geocoder;
    geoCoder.geocode({ 'location': { lat: marker.latitude, lng: marker.longitude } }, (results, status) => {
     
      if (status === 'OK') {
        if (results[0]) {
          //this.zoom = 12;
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
      serialNumber:this.vehicle.device_id
    }
    //this.commonUtilsService.showPageLoader(); 
    this.dataService.listingDeviceLogs(searchLogObject).subscribe(response => {
        this.logsCount = {
          ldwLState:0,
          ldwRState:0,
          sdaState:0,
          vcwState:0

        }
        console.log(response);
        if(response != null && response.length>0){
          
          this.ngZone.run( () => {
            
            var ldwL=0, ldwR=0, sda=0, vcw=0, vb=0, fcda=0, pd=0;
            var alertStatus = "";
            var order = 0;
            $(response.reverse()).each(function (i, item) { 
              if(order+1 != i){
	    					alertStatus="";
              }
              
              if((item.ldwState & 1) == 1 && alertStatus != "ldwL"){
	    					
                ldwL++;
	    					alertStatus = "ldwL";
	    					order = i;
              }
              if((item.ldwState & 2) == 2 && alertStatus != "ldwR"){
	    					
	    					ldwR++;
	    					alertStatus = "ldwR";
	    					order = i;
              }
              if((item.vdState & 2) == 2 && alertStatus != "sda"){  
	    					sda++;
	    					alertStatus = "sda";
                order = i;
              }
              if((item.vdState & 16) == 16 && alertStatus != "vcw"){               
	    					
	    					vcw++;
	    					alertStatus = "vcw";
                order = i;
              }
            }) 

            
            //calculating ldwState count
            let ldwLeftStateLogs = response.filter((log) => (log.ldwState == 1)).map((log) => log);          
            //this.logsCount['ldwState'] = ldwLeftStateLogs.length;
            
            let ldwRightStateLogs = response.filter((log) => (log.ldwState == 2)).map((log) => log);          
            this.logsCount['ldwLState'] = ldwL;
            this.logsCount['ldwRState'] = ldwR; 
            this.logsCount['sdaState'] = sda;
            this.logsCount['vcwState'] = vcw; 
           });

                  
        }      
          
        //console.log(this.logsCount);
        this.commonUtilsService.hidePageLoader();
     }, error => {
        this.commonUtilsService.onError(error);
     }) 
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  

}
