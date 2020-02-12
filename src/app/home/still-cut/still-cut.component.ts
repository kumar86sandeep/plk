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
  currentVideo:any; 
  deviceId:any;
  images:any = []
  stillObj:any = {}
  hasMorePages:boolean = false;
  paginate = {  
    limit: 10,   
    offset:1,
    deviceId:''
  }
  
 
  vehicles:any; //fromdb
  vehicle:any;
  totalVehicles:any;
  deviceMarkers:any; //from cloud server
  lat:any;
  lng:any;
  company_id:any;
  constructor(private vehicleService:VehicleService, private dataService:DataService, private activatedRoute: ActivatedRoute, private location:Location, private titleService:TitleService, private commonUtilsService:CommonUtilsService) {
    this.deviceId  =  this.activatedRoute.snapshot.params.deviceId
    this.paginate.deviceId = this.deviceId ;
    let company = JSON.parse(localStorage.getItem('user'));
    this.company_id = company._id;
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
     console.log(stillObj);
     this.currentVideo = stillObj.currentVideo
    this.commonUtilsService.showPageLoader(environment.MESSAGES.FETCHING_IMAGES); 
      this.stillObj = stillObj
      this.dataService.stillcutImage(stillObj).subscribe(response => {        
        console.log('response',response);
        this.images = response
        this.commonUtilsService.hidePageLoader();  
        $(this.stillcutImagesSection.nativeElement).modal({backdrop: 'static', keyboard: false, hide: true});
         
           
      }, error => {
        this.commonUtilsService.onError(error);
      })
   }

   requestEvent(filename){   
   
    Swal.fire({
      title: 'Are you sure to request this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var formData: any = new FormData();
        
       
        formData.append("parameter", `"{lastKey:${this.stillObj.lastKey},jpgTime:${this.stillObj.jpgTime}}"`);

        
        this.commonUtilsService.showPageLoader('Processing...'); 
          this.dataService.stillcutImagesRequest(formData, this.deviceId).subscribe(response => {
            this.commonUtilsService.hidePageLoader(); 
            if(response.error){
              Swal.fire(
                'Error!',
                'We already have received a request for the same stillcut.',
                'error'
              )
              $(this.stillcutImagesSection.nativeElement).modal({hide: true});
            }else{
              Swal.fire(
                'Done!',
                'Your request has been processed. The video should momentarily available in Dash Cam Event Page.',
                'success'
              )
              $(this.stillcutImagesSection.nativeElement).modal({hide: true});
            }
            
            
            
            //this.commonUtilsService.onSuccess("Your request has been sent successfully.")
          }, error => {
            this.commonUtilsService.onError(error);
            
          })
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
      // this.router.navigate(['/home/listing'])
      return;
    }
    this.vehicle = this.vehicles[index];
    this.vehicles[index]['isOpen'] = true 
  }, error => {

  })
}

}
