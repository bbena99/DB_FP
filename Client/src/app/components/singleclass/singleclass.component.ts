import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Assignment } from 'src/app/models/assignment';
import { Class } from 'src/app/models/class';
import { Student } from 'src/app/models/student';
import { Submission } from 'src/app/models/submission';
import { AssignmentService } from 'src/app/services/assignment.service';
import { ClassService } from 'src/app/services/class.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-singleclass',
  templateUrl: './singleclass.component.html',
  styleUrls: ['./singleclass.component.css']
})
export class SingleclassComponent implements OnInit {
  @Input() newAssign:Assignment
  class!:Class
  page:number=0
  isTeacher:boolean=false
  modalBool:boolean=false
  firstNameFilter:string=""
  lastNameFilter:string=""
  usernameFilter:string=""
  submissionMap?:Map<String,Submission>
  assignmentMap?:Map<String,Assignment>
  studentMap?:Map<String,Student>
  filteredMap?:Map<String,Student>
  classRoster?:Map<String,boolean>

  constructor(
    private router : Router,
    private classService : ClassService,
    private userService : UserService,
    private assignmentService : AssignmentService
  ){
    this.ngOnInit()
    let date = new Date()
    this.newAssign = {
      AssignmentId:"",
      AssignName:"",
      Description:"",
      FileType:[],
      TotalPoints:0,
      Visibility:false,
      dueData:"",
      ...this.class
    }
  }
  ngOnInit(){
    let location = window.location.href.split('/')
    let key = location[location.length-1]
    let tempClass = this.classService.getSingleByUser(key)
    if(tempClass) this.class = tempClass
    else this.router.navigateByUrl('/Classes')
    const classId = `${this.class.Department}~${this.class.CourseNumber}~${this.class.Section}`
    console.log(this.class)
    if(this.class.Username===this.class.TeacherUsername){
      this.assignmentMap=new Map<String,Assignment>()
      this.studentMap=new Map<String,Student>()
      this.classRoster=new Map<String,boolean>()
      this.isTeacher=true
      console.log("Teacher")
      this.userService.getAllStudents().subscribe(studentList=>{
        studentList.map(student=>{
          this.studentMap!.set(student.Username,student)
          this.classRoster!.set(student.Username,false)
        })
        this.filter()
        this.classService.getClassRoster(this.class.Username,classId).subscribe(s=>{
          s.map((s)=>{
            this.classRoster?.set(s.Username,true)
          })
        })
      })
      this.assignmentService.getAllByTeacher(this.class.Username,classId).subscribe(assignArr=>{
        assignArr.forEach(a=>{
          this.assignmentMap!.set(a.AssignmentId,a)
        })
      })
    } else {
      this.submissionMap=new Map<String,Submission>()
      this.assignmentService.getAllByStudent(this.class.Username,classId).subscribe(subArr=>{
        subArr.forEach(s=>{
          this.submissionMap!.set(s.SubmissionId,s)
        })
      })
    }
  }
  filter(){
    this.filteredMap = new Map<String,Student>([...this.studentMap!].filter(([key,std])=>{
      if(std.FirstName.includes(this.firstNameFilter)&&
      std.LastName.includes(this.lastNameFilter)&&
      std.Username.includes(this.usernameFilter))return [key,std];
      return undefined
    }))
  }
  getBool(key:String):boolean{
    let retBool = this.classRoster?.get(key)
    if(retBool)return retBool
    else return false
  }
  runSave(){
    let sendMap = new Map<String,Student>()
    this.classRoster?.forEach((val,key)=>{
      if(val)sendMap.set(key,this.studentMap!.get(key)!)
    })
    const classId= `${this.class.Department}~${this.class.CourseNumber}~${this.class.Section}`
    this.classService.setStudentsInClass(this.class.Username,sendMap,classId).subscribe(b=>{console.log(b)})
  }
  createAssign(){
    const classId = `${this.class.Department}~${this.class.CourseNumber}~${this.class.Section}`
    this.assignmentService.createNewAssignment(this.class.Username,classId,this.newAssign).subscribe(a=>{
      let date = new Date()
      this.newAssign = {
        AssignmentId:"",
        AssignName:"",
        Description:"",
        FileType:[],
        TotalPoints:0,
        Visibility:false,
        dueData:"",
        ...this.class
      }
    })
  }
  debug(){
    console.log(this.newAssign)
  }
}
