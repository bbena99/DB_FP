import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student';
import { Teacher } from '../models/teacher';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL : string = Constants.API_VERSION
  private UserList : Student[]|Teacher[] = []
  public userSubject : BehaviorSubject<Student[]|Teacher[]>

  constructor(
    private authService : AuthService,
    private http : HttpClient,
  ) {
    this.userSubject = new BehaviorSubject<Student[]|Teacher[]>([])
  }
  //List of internal Functions
  setUsers(u:Student[]|Teacher[]){
    this.UserList=u
    this.userSubject.next(this.UserList)
  }
  //List of external Functions
  getAllStudents():Observable<Student[]>{
    return this.http
      .get<Student[]>(this.URL+"/Users?userType=Student")
      .pipe<Student[]>(tap(u=>{
        this.setUsers(u)
      }))
  }
  getAllTeachers():Observable<Teacher[]>{
    return this.http
      .get<Teacher[]>(this.URL+"/Users?userType=Teacher")
      .pipe<Teacher[]>(tap(u=>{
        this.setUsers(u)
      }))
  }
}
