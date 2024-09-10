import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotificationComponent } from './notification/notification.component';
import { AproposComponent } from './apropos/apropos.component';

export const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' }, 
    { path: 'home', component: HomeComponent},    
    { path: 'notif', component: NotificationComponent},   
    { path: 'apropos', component: AproposComponent},          
];
