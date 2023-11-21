import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  User : Student|Teacher|undefined

  constructor(
    private authService:AuthService,
    private router:Router
  ){
    authService.userSubject.subscribe((user:Student|Teacher|undefined)=>{
      this.User=user
    },(error)=>{
      console.error("ERROR: Not logged in")
      router.navigateByUrl("/Login")
    })
    if(!this.User)router.navigateByUrl("/Login")
    this.ngOnInit()
  }
  ngOnInit(){}
  isAuthenticated():Boolean{
    if(this.User){
      //this.router.navigateByUrl("/DashBoard")
      return true
    }
    return false
  }

  logout(){
    this.authService.logout().subscribe( () => this.router.navigateByUrl("/Login"));
  }
}
