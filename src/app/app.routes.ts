import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { PricesComponent } from './prices/prices.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },         // Тук се зарежда Hero секцията
  { path: 'schedule', component: ScheduleComponent }, // Тук се зарежда само графикът
  { path: 'about-me', component: AboutMeComponent } ,
  { path:   'prices', component: PricesComponent }
];
