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
  classList : Map<String,Class> = new Map<String,Class>()
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
          this.classList.set(`${c.Department}-${c.CourseNumber}.${c.Section}`,c)
        })
        this.teacherBool = authService.isTeacher()
        console.log(this.classList.keys())
        console.log(this.classList)
      })
    })
    //@ts-ignore
    if('DepartmentNumber' in this.user)this.departIndex = this.user.DepartmentNumber
    console.log(this.departIndex)
    this.newClass={
      Username:"",
      FirstName:"",
      LastName:"",
      DepartmentId:0,
      ReportsTo:"",
      Name:"",
      Department:this.departLabel[this.departIndex],
      CourseNumber:0,
      Section:0
    }
    console.log(this.newClass)
  }
  nav(classStr:String){
    this.router.navigateByUrl("/Classes/"+classStr)
  }
  createClass(){
    if(this.teacherBool==false)return
    //@ts-ignore
    this.classService.createClass(this.user,this.newClass).subscribe((c)=>{
      this.newClass.Name=""
      this.newClass.CourseNumber=0
      this.newClass.Section=0
      this.router.navigateByUrl("/Classes")
    })
  }
}
