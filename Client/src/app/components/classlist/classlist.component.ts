import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class';
import { Teacher } from 'src/app/models/teacher';
import { Student } from 'src/app/models/student';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classlist',
  templateUrl: './classlist.component.html',
  styleUrls: ['./classlist.component.css']
})
export class ClasslistComponent {
  @Input() newClass : Class
  user! : Teacher | Student
  classList : Map<Number,Class> = new Map<Number,Class>([])
  teacherBool : Boolean = false
  modalBool: Boolean = false

  departIndex:number=0
  departLabel:String[]=[
    'CS',
    'PSY',
    'MTH',
    'ENG',
    'BIO',
    'IS'
  ]

  constructor(
    private authService : AuthService,
    private classService : ClassService,
    private router : Router
  ){
    authService.getAuthenticatedUser().subscribe((u)=>{
      if(!u)router.navigateByUrl("/")
      this.user = u
      classService.getAllByUser(this.user).subscribe((cl:Class[])=>{
        console.log(cl)
        cl.map((c:Class)=>{
          this.classList.set(c.CourseNumber,c)
        })
        this.teacherBool = authService.isTeacher()
        console.log(this.classList.keys())
        console.log(this.classList)
        console.log("teacherBool:",this.teacherBool)
      })
    })
    //@ts-ignore
    if('DepartmentID' in this.user)this.departIndex = this.user.DepartmentID
    this.newClass={
      Name:"",
      Department:this.departLabel[this.departIndex],
      CourseNumber:0,
      Section:0
    }
  }
  createClass(){
    if(this.teacherBool==false)return
    //@ts-ignore
    this.classService.createClass(this.user,this.newClass).subscribe()
  }
}
