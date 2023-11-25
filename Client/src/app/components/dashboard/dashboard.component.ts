import { Component } from '@angular/core';
import { Assignment } from 'src/app/models/assignment';
import { Class } from 'src/app/models/class';
import { Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';
import { AssignmentService } from 'src/app/services/assignment.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  byDateBool : Boolean = true
  byDateMap : Map<String,Assignment[]> = new Map()
  byClassMap : Map<Number,Assignment[]> = new Map()
  user! : Student|Teacher
  assignmentArray! : Assignment[]

  constructor(
    private authService : AuthService,
    private assignmentService : AssignmentService
  ) {
    authService.getAuthenticatedUser().subscribe(
      u => this.user=u
    )
    assignmentService.getAllByUser(this.user)?.subscribe(
      a => this.assignmentArray=a
    )
    if(this.assignmentArray)this.assignmentArray.forEach((assign:Assignment)=>{
      this.addDate(assign)
      this.addClass(assign)
    })
  }
  private addDate(assign:Assignment){
    let dateArray = this.byDateMap.get(assign.dueData)
    if(dateArray){
      dateArray.push(assign)
      this.byDateMap.set(assign.dueData,dateArray)
    }
    let newArray:Assignment[]=[]
    newArray.push(assign)
    this.byDateMap.set(assign.dueData,newArray)
  }
  private addClass(assign:Assignment){
    let classArray = this.byClassMap.get(assign.class.CourseNumber)
    if(classArray){
      classArray.push(assign)
      this.byClassMap.set(assign.class.CourseNumber,classArray)
    }
    let newArray:Assignment[]=[]
    newArray.push(assign)
    this.byClassMap.set(assign.class.CourseNumber,newArray)
  }

  changeBool(bool:Boolean){
    this.byDateBool=bool
    this.log()
  }
  log(){
    console.log(this.byDateBool)
  }
}
