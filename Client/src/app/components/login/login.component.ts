import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Input() username? : string
  @Input() password? : string
  loginError : boolean = false

  constructor(
    private router : Router,
    private authService : AuthService
  ) {
    this.ngOnInit()
  }
  ngOnInit(){
    this.authService.getAuthenticatedUser().subscribe((res)=>{
      if(res)this.router.navigateByUrl( 'DashBoard' );
    });
  }
  login(){
    if( this.username && this.password){
      this.authService.login(this.username,this.password).subscribe(
        (user)=>{
          //console.log("Made it through .login() from authService");
          this.username = '';
          this.password = '';
          this.router.navigateByUrl( 'blog' );
        },
        (error)=>{

        })
    }
  }
  openModal(){

  }
}
