import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Input() username? : string
  @Input() password? : string
  @Input() newUsername? : string
  @Input() newPassword? : string
  modalBool : boolean = false
  loginError : boolean = false

  constructor(
    private router : Router,
    private authService : AuthService
  ) {
    this.ngOnInit()
  }
  ngOnInit(){
    this.authService.getAuthenticatedUser().subscribe((res)=>{
      if(res)this.router.navigateByUrl( '/DashBoard' );
    });
  }
  login(){
    if( this.username && this.password){
      this.authService.login(this.username,this.password).subscribe(
        (user)=>{
          this.username = '';
          this.password = '';
          this.router.navigateByUrl( '/DashBoard' );
        },
        (error)=>{
          //console.error(error)
        })
    }
  }
  createUser(){
    if( this.newUsername && this.newPassword ){
      this.authService.createUser(this.newUsername,this.newPassword).subscribe((res)=>{
        this.newUsername=""
        this.newPassword=""
        if(res)this.router.navigateByUrl('/DashBoard')
      },(error)=>{
        //console.error(error)
      })
    }
  }
  handleModal(){
    this.modalBool=!this.modalBool
  }

}
