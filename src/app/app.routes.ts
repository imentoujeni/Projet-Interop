import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotificationComponent } from './notification/notification.component';
import { AproposComponent } from './apropos/apropos.component';
import { PaiementComponent } from './paiement/paiement.component';
import { NoticeComponent } from './notice/notice.component';

export const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' }, 
    { path: 'home', component: HomeComponent},    
    { path: 'notif', component: NotificationComponent},   
    { path: 'apropos', component: AproposComponent},   
    { path: 'facture', component: PaiementComponent},   
    { path: 'notice', component: NoticeComponent},       
];
