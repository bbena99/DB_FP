import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { EventsComponent } from './components/events/events.component';

const routes: Routes = [
  {path: 'Login', component : LoginComponent},
  {path: 'Calendar', component : CalendarComponent, canActivate: [authGuard]},
  {path: 'Account', component : ProfileComponent, canActivate: [authGuard]},
  {path: 'EventList', component : EventsComponent, canActivate: [authGuard]},
  {path: '**', redirectTo: 'Login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
