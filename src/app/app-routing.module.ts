import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,   
    data: { title: 'Login' }
  },
  {
    path:'forgot-password',
    component:ForgotPasswordComponent,
    data:{ title:'Forgot Password' }
  }, 
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  }    
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
