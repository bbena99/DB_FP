import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @Input() typeOfUser : string = 'Student'
  @Input() username? : string
  @Input() password? : string
  @Input() newUsername? : string
  @Input() newPassword? : string
  @Input() firstName! : string
  @Input() lastName! : string
  @Input() department? : number
  @Input() reportsTo? : string
  modalBool : boolean = false
  loginError : boolean = false
  typeDef:String[]=['Student','Teacher']
  departDef:String[]=[
    'Computer Science',
    'Mathmatics',
    'English',
    'Biology',
    'Information Science'
  ]

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
      this.authService.login(this.typeOfUser,this.username,this.password).subscribe(
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
      this.authService.createUser(this.typeOfUser, this.firstName,this.lastName, this.newUsername,this.newPassword,this.department).subscribe((res)=>{
        this.firstName=''
        this.lastName=''
        this.newUsername=''
        this.newPassword=''
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
