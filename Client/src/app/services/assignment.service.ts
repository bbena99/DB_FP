import { Injectable, OnInit } from '@angular/core';
import { Assignment } from '../models/assignment';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student';
import { Teacher } from '../models/teacher';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Class } from '../models/class';
import { ClassService } from './class.service';
import { Submission } from '../models/submission';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService implements OnInit {
  //Variables
  private URL : string = Constants.API_VERSION
  private assignMap : Map<String,Assignment>
  private submissionMap : Map<String,Submission>
  public assignSubject : BehaviorSubject<Map<String,Assignment>>
  public submissionSubject : BehaviorSubject<Map<String,Submission>>

  constructor(
    private http : HttpClient,
    private classService : ClassService
    ) {
    this.assignMap = new Map<String,Assignment>()
    this.assignSubject = new BehaviorSubject<Map<String,Assignment>>(this.assignMap)
    this.submissionMap = new Map<String,Submission>()
    this.submissionSubject = new BehaviorSubject<Map<String,Submission>>(this.submissionMap)
    this.ngOnInit()
  }
  ngOnInit(): void {
  }

  //Start of internal function calls
  private setSingleSubmission(sub:Submission):Map<String,Submission>{
    this.submissionMap.set(sub.SubmissionId,sub)
    this.submissionSubject.next(this.submissionMap)
    console.log("assignment.service.ts.setSingleSubmission()")
    console.log(this.submissionMap)
    return this.submissionMap
  }
  private setMultiSubmissions(subs:Submission[]):Map<String,Submission>{
    subs.forEach(sub=>{
      this.submissionMap.set(sub.SubmissionId,sub)
    })
    this.submissionSubject.next(this.submissionMap)
    console.log("assignment.service.ts.setMultiSubmission()")
    console.log(this.submissionMap)
    return this.submissionMap
  }
  public getAllSubmissions():Map<String,Submission>{
    console.log("assignment.service.ts.getAllSubmission()")
    console.log(this.submissionMap)
    return this.submissionMap
  }
  public getSingleSubmission(id:String):Submission|undefined{
    console.log("assignment.service.ts.getSingleSubmission()")
    return this.submissionMap.get(id)
  }

  private setSingleAssignment(assign:Assignment):Map<String,Assignment>{
    this.assignMap.set(assign.AssignmentID,assign)
    this.assignSubject.next(this.assignMap)
    console.log("assignment.service.ts.setSingleAssignments()")
    console.log(this.assignMap)
    return this.assignMap
  }
  private setMultiAssignments(assigns:Assignment[]):Map<String,Assignment>{
    assigns.forEach(assign=>{
      this.assignMap.set(assign.AssignmentID,assign)
    })
    this.assignSubject.next(this.assignMap)
    console.log("assignment.service.ts.setMultiAssignments()")
    console.log(this.assignMap)
    return this.assignMap
  }
  public getAllAssignments():Map<String,Assignment>{
    console.log(this.assignMap)
    return this.assignMap
  }
  public getSingleAssignment(id:String):Assignment|undefined{
    console.log(this.assignMap.get(id))
    return this.assignMap.get(id)
  }

  //Start of external function calls
  public getAllByStudent(userName:String,classId:String) : Observable<Submission[]> {
    return this.http
      .get<Submission[]>(this.URL+`/Users/${userName}/Classes/${classId}/Assignments?userType=Student`)
      .pipe<Submission[]>(tap(res=>this.setMultiSubmissions(res)))
  }
  public createNewSubmission(userName:String,classId:String,assignId:String,submission:Submission):Observable<Submission>{
    return this.http
      .post<Submission>(this.URL+`Users/${userName}/Classes/${classId}/Assignments/${assignId}/Submissions/`,submission)
      .pipe<Submission>(tap(s=>this.setSingleSubmission(s)))
  }
  public getAllByTeacher(userName:String,classId:String):Observable<Assignment[]> {
    return this.http
      .get<Assignment[]>(this.URL+`/Users/${userName}/Classes/${classId}/Assignments?userType=Teacher`)
      .pipe<Assignment[]>( tap( a => this.setMultiAssignments(a) ))
  }
  public createNewAssignment(userName:String,classID:String,assign:Assignment):Observable<Assignment>{
    return this.http
      .post<Assignment>(this.URL+`/Users/${userName}/Classes/${classID}/Assignments/`,assign)
      .pipe<Assignment>(tap( a => this.setSingleAssignment(a) ))
  }
}
