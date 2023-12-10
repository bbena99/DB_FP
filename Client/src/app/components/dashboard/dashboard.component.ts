import { Component, OnInit } from '@angular/core';
import { Assignment } from 'src/app/models/assignment';
import { Class } from 'src/app/models/class';
import { Student } from 'src/app/models/student';
import { Submission } from 'src/app/models/submission';
import { Teacher } from 'src/app/models/teacher';
import { AssignmentService } from 'src/app/services/assignment.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  teacherBool : boolean = false
  byDateBool : Boolean = true
  byDateMapT : Map<String,Assignment[]> = new Map()
  byClassMapT : Map<String,Assignment[]> = new Map()
  byDateMapS : Map<String,Submission[]> = new Map()
  byClassMapS : Map<String,Submission[]> = new Map()
  user! : Student|Teacher

  constructor(
    private authService : AuthService,
    private classService : ClassService,
    private assignmentService : AssignmentService
  ) {
    this.ngOnInit()
  }
  ngOnInit(): void {
    this.authService.getAuthenticatedUser().subscribe(u=>{
      this.user=u
    })
    let classArr:Class[] =[]
    this.classService.getAllByUser(this.user).subscribe(cArr=>{
      classArr=cArr
    })
    let classID:String[]=[]
    classArr.forEach(c=>{
      classID.push(`${c.Department}~${c.CourseNumber}~${c.Section}`)
    })
    this.teacherBool = this.authService.isTeacher()
    if(this.teacherBool){
      classID.forEach(id=>{
        this.assignmentService.getAllByTeacher(this.user.Username,id).subscribe(assignArr=>{
          assignArr.forEach(a=>{
            let tempArr = this.byDateMapT.get(a.DueDate)
            if(tempArr){
              tempArr = [...tempArr]
              tempArr.push(a)
            }
            else tempArr=[a]
            this.byDateMapT.set(a.DueDate,tempArr)
            tempArr = this.byClassMapT.get(id)
            if(tempArr){
              tempArr=[...tempArr]
              tempArr.push(a)
            }
            else tempArr=[a]
            this.byClassMapT.set(id,tempArr)
          })
        })
      })
    }else{
      classID.forEach(id=>{
        this.assignmentService.getAllByStudent(this.user.Username,id).subscribe(subArr=>{
          subArr.forEach(s=>{
            let tempArr = this.byDateMapS.get(s.DueDate)
            if(tempArr){
              tempArr = [...tempArr]
              tempArr.push(s)
            }
            else tempArr=[s]
            this.byDateMapS.set(s.DueDate,tempArr)
            tempArr = this.byClassMapS.get(id)
            if(tempArr){
              tempArr=[...tempArr]
              tempArr.push(s)
            }
            else tempArr=[s]
            this.byClassMapS.set(id,tempArr)
          })
        })
      })
    }
  }
}
