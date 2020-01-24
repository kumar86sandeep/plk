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
  vehicle:any;
  constructor(private vehicleService:VehicleService, private dataService:DataService, private activatedRoute: ActivatedRoute, private location:Location, private titleService:TitleService, private commonUtilsService:CommonUtilsService) {
    this.deviceId  =  this.activatedRoute.snapshot.params.deviceId
    this.paginate.deviceId = this.deviceId 
   }

  ngOnInit() {
    this.titleService.setTitle();
    this.fetchResults();
    this.fetchVehicleDetails();
    
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

  private fetchVehicleDetails():void{
      this.vehicleService.getVehicle(this.deviceId).subscribe(response=>{
       this.vehicle = response;
      },error=>{

      })
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

   

}
