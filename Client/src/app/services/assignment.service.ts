import { Injectable } from '@angular/core';
import { Assignment } from '../models/assignment';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student';
import { Teacher } from '../models/teacher';
import { Observable, tap } from 'rxjs';
import { Class } from '../models/class';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  //Variables
  private URL : string = Constants.API_VERSION
  private assignArray : Assignment[] = []

  constructor(
    private http : HttpClient,
  ) { }

  //Start of internal function calls

  //Start of external function calls
  getAllByUser(user:Student|Teacher) : Observable<Assignment[]>|undefined {
    const API = this.URL+"/assignments/user"
    let id : Number
    if('SId' in user)id = user.SId
    else if('TId' in user)id = user.TId
    else{
      console.error("ERROR: Invalid credentials passed into getAllByUser(user:Student|Teacher) in class.service.ts")
      return undefined
    }
    return this.http
      .get<Assignment[]>(API+`?id=${id}`)
      .pipe<Assignment[]>( tap( a => this.assignArray=a ))
  }
  getAllByClass(classObj:Class):Observable<Assignment[]> {
    const API = this.URL+"/assignments/class"
    let query = `?DepartmentId=${classObj.Department}&CourseNumber=${classObj.CourseNumber}`
    return this.http
      .get<Assignment[]>(API+query)
      .pipe<Assignment[]>( tap( a => this.assignArray=a ))
  }
}
