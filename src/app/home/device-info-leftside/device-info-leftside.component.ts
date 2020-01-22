import { Component, OnInit, NgZone, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { DataService, CommonUtilsService } from '../../core/services/index'
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-device-info-leftside',
  templateUrl: './device-info-leftside.component.html',
  styleUrls: ['./device-info-leftside.component.css']
})
export class DeviceInfoLeftsideComponent implements OnInit {
  intervalId:any;
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
  logsDate: any;
  //deviceId:any;
  deviceAddress:string;
  logsDateSearchForm: FormGroup;
  @Input() deviceId: string;

  constructor(private dataService:DataService, private activatedRoute: ActivatedRoute, private location:Location, private commonUtilsService:CommonUtilsService, private router: Router, private calendar: NgbCalendar, private formBuilder: FormBuilder, private ngZone: NgZone) { 
    this.logsDate = this.calendar.getToday();
  }

  ngOnInit() {
    this.logsDateSearchForm = this.formBuilder.group({
      logSearchDate: [this.logsDate]     
    });
    this.fetchDeviceLogs();
    window.setInterval(() => this.fetchDeviceLogs(), 10000);
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

  goBack(){
    this.location.back();
  }

  fetchDeviceLogs(){
    let searchLogObject = {
      date:this.logsDate,
      serialNumber:this.deviceId
    }
    //this.commonUtilsService.showPageLoader(); 
    this.dataService.listingDeviceLogs(searchLogObject).subscribe(response => {
        this.logsCount = {
          ldwLState:0,
          ldwRState:0,
          vdState:0,
          pdState:0

        }
        console.log(response);
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
