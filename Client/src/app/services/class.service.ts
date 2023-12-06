import { Injectable, OnInit } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Class } from '../models/class';
import { Teacher } from '../models/teacher';
import { Student } from '../models/student';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  //Variables
  private URL : string = Constants.API_VERSION
  private classes : Map<String,Class>
  public classSubject : BehaviorSubject<Map<String,Class>>

  constructor(
    private authService : AuthService,
    private http : HttpClient,
  ) {
    this.classes = new Map<String,Class>()
    this.classSubject = new BehaviorSubject<Map<String,Class>>(this.classes)
    this.ngOnInit()
  }

  ngOnInit(){
    this.authService.getAuthenticatedUser().subscribe(u=>{
      this.getAllByUser(u).subscribe()
    })
  }

  //Start of internal function calls
  getSingleByUser(classStr:String) : Class|undefined{
    return this.classes.get(classStr)
  }

  setClasses(c:Class[]):Map<String,Class>{
    console.log(c)
    c.map((c)=>{
      let key = `${c.Department}-${c.CourseNumber}.${c.Section}`
      this.classes.set(key,c)
    })
    this.classSubject.next(this.classes)
    return this.classes
  }

  //Start of external function calls
  createClass(user:Teacher,newClass:Class) : Observable<Class[]>|undefined {
    return this.http
      .post<Class[]>(this.URL+`/Users/${user.Username}/Classes/`,newClass)
      .pipe<Class[]>( tap( c => {
        this.setClasses(c)
      }))
  }
  getAllByUser(user:Student|Teacher) : Observable<Class[]>{
    console.log(user)
    const bool = this.authService.isTeacher()
    return this.http
      .get<Class[]>(this.URL+`/Users/${user.Username}/Classes?Teacherbool=${bool}`)
      .pipe<Class[]>( tap( c => this.setClasses(c) ))
  }
}
