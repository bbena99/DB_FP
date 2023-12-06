import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Constants } from '../constants/constants';
import { Student } from '../models/student';
import { Teacher } from '../models/teacher';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL : string = Constants.API_VERSION
  private user : Student | Teacher | undefined;
  private teacherBool : boolean = false
  public userSubject : BehaviorSubject<Student|Teacher|undefined> = new BehaviorSubject<Student|Teacher|undefined>( undefined )
  constructor(private http : HttpClient) {
    this.ngOnInit()
  }
  ngOnInit(){
    this.getAuthenticatedUser().subscribe()
  }
  //Start of internal function calls
  isTeacher():boolean{
    return this.teacherBool
  }
  setUser(user : Student | Teacher | undefined ): void {
    this.user = user
    if (this.user){
      if('DepartmentNumber' in this.user!)this.teacherBool=true
      window.localStorage.setItem('user', JSON.stringify( user ))
    } else {
      this.teacherBool=false
      window.localStorage.removeItem('user')
    }
    this.userSubject.next( user )
  }
  fetchUser() : Observable<Student|Teacher> {
    return this.http
      .get<Student|Teacher>(this.URL + "/who")
      .pipe(tap(user=>{
        this.setUser(user)
      }))
  }

  //Start of main external function calls w/ backend calls.
  getAuthenticatedUser() : Observable<Student|Teacher> {
    let localUser = window.localStorage.getItem('user')
    if(localUser){
      let user : Student|Teacher = JSON.parse( localUser as string ) as Student|Teacher
      this.setUser( user )
      return of(user)
    } else {
      return this.fetchUser()
    }
  }
  login( typeOfUser : string, username : string, password : string ) : Observable<Student|Teacher> {
    const API = this.URL + "/login"
    let credentials = `?userType=${typeOfUser}&username=${username}&password=${password}`
    return this.http
      .post<Student|Teacher>( API+credentials,undefined)
      .pipe<Student|Teacher>( tap( u =>{
        console.log(u)
        this.setUser( u )
      }))
    }
  createUser( typeOfUser:string, firstName:string, lastName:string, username:string, password:string, department?:number ) : Observable<Student|Teacher> {
    const API = this.URL + "/createUser"
    let credentials = `?userType=${typeOfUser}&firstname=${firstName}&lastname=${lastName}&username=${username}&password=${password}`
    if(department)credentials=credentials+"&departmentId="+department
    return this.http
      .post<Student|Teacher>( API+credentials,undefined)
      .pipe<Student|Teacher>( tap( u =>{
        console.log(u)
        this.setUser( u )
      }))
  }
  logout() {
    const API = this.URL+"/logout"
    return this.http
      .post<Student|Teacher>(API,{})
      .pipe( tap( ()=>this.setUser(undefined) ) )
  }
  isUser():boolean{
    if(this.getAuthenticatedUser())return true
    let tempUser:Student|Teacher|undefined
    this.http.get<Student|Teacher>('/users/')
      .pipe( tap( user => tempUser = user ) )
    if(tempUser)return true
    return false
  }
}
