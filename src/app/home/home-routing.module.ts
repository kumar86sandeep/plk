import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceListingComponent } from './device-listing/device-listing.component';
import { DeviceEventsListingComponent } from './device-events-listing/device-events-listing.component';
import { EventVideoListingComponent } from './event-video-listing/event-video-listing.component';
import { DeviceLogsComponent } from './device-logs/device-logs.component';
import { StillCutComponent } from './still-cut/still-cut.component';

//importing guards
import { AuthGuardService } from '../core/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listing',
    pathMatch: 'full'
  },
  {
    path: 'listing',
    component: DeviceListingComponent,   
    data: { title: 'Device Listing' },
    canActivate:[AuthGuardService]
  },
  {
    path: 'device-logs/:deviceId',
    component: DeviceLogsComponent,     
    data: { title: 'Device Logs Listing' },
    canActivate:[AuthGuardService]
  },
  {
    path: 'device-events/:deviceId',
    component: DeviceEventsListingComponent,
    data: { title: 'Device Events Listing' },
    canActivate:[AuthGuardService]
  },
  {
    path: 'event-videos/:filekey/:deviceId',
    component: EventVideoListingComponent,
    data: { title: 'Event Video Listing' },
    canActivate:[AuthGuardService]
  },
  {
    path: 'still-cut/:deviceId',
    component: StillCutComponent,
    data: { title: 'Device Still cut Listing' },
    canActivate:[AuthGuardService]
  }
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class HomeRoutingModule { }
