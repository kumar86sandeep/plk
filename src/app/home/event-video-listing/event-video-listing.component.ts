import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

import { DataService, TitleService } from '../../core/services/index'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-event-video-listing',
  templateUrl: './event-video-listing.component.html',
  styleUrls: ['./event-video-listing.component.css']
})
export class EventVideoListingComponent implements OnInit {
 
  videoListing:any = []
  videoSrc:string='';
  listView:boolean = true
  deviceId:string;
  filekey:string;
  downloadUrl:any;
  constructor(private dataService:DataService, private activatedRoute: ActivatedRoute, private location:Location, private titleService:TitleService) { }

  ngOnInit() {
    this.titleService.setTitle();  
    this.filekey = this.activatedRoute.snapshot.params.filekey;
    this.deviceId = this.activatedRoute.snapshot.params.deviceId;
    this.downloadUrl = `${environment.PLKCONFIG.URL}rec/${atob(this.filekey).replace("fmsvideo", "fmsvideoDownload")}`
    this.dataService.listingEventVideos(atob(this.filekey)).subscribe(response => {
      this.videoListing = response
      console.log(this.videoListing);
      if(this.videoListing.length>0)
          this.videoSrc = this.videoListing[0]
          console.log('videoSrc',this.videoSrc);
    }, error => {
      
    })
    
  }

  putVideoSource(source){
    this.videoSrc = source
  }

  goBack(){
    this.location.back();
  }

  changeListing(type){
    if(type=='list')
      this.listView = true
    else
      this.listView = false
  }

}
