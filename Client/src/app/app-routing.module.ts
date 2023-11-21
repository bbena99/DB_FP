import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {path: 'Login', component : LoginComponent},
  {path: 'DashBoard', component : DashboardComponent, canActivate: [AuthGuard]},
  {path: 'Account', component : ProfileComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'Login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
