import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { HomeRoutingModule } from './home-routing.module';
import { AgmCoreModule } from '@agm/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DeviceListingComponent } from './device-listing/device-listing.component';
import { DeviceEventsListingComponent } from './device-events-listing/device-events-listing.component';
import { EventVideoListingComponent } from './event-video-listing/event-video-listing.component';
import { DeviceLogsComponent } from './device-logs/device-logs.component';
import { StillCutComponent } from './still-cut/still-cut.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    DeviceListingComponent,
    DeviceEventsListingComponent,
    EventVideoListingComponent,
    DeviceLogsComponent,
    StillCutComponent
  ],
  
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HomeRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAr1rjaSGDlYfMOOIXGmkU6pEkTP2q628E'
    }),
    PerfectScrollbarModule,
    NgbModule
  ],

  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
})
export class HomeModule { }
