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
  private classes : Class[] = []
  public classSubject : BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([])

  constructor(
    private authService : AuthService,
    private http : HttpClient,
  ) {
    this.ngOnInit()
  }

  ngOnInit(){
    this.authService.getAuthenticatedUser().subscribe(u=>{
      this.getAllByUser(u).subscribe()
    })
  }

  //Start of internal function calls
  setClasses(c:Class[]){
    this.classes = c
    this.classSubject.next(c)
  }

  //Start of external function calls
  createClass(user:Teacher,newClass:Class) : Observable<Class>|undefined {
    return this.http
      .post<Class>(this.URL+`/Users/${user.Username}/Classes/`,newClass)
      .pipe<Class>( tap( c => {
        this.classes[c.CourseNumber]=c
        newClass.CourseNumber=0
        newClass.Name=""
        newClass.Section=0
      }))
  }
  getAllByUser(user:Student|Teacher) : Observable<Class[]>{
    console.log(user)
    return this.http
      .get<Class[]>(this.URL+`/Users/${user.Username}/Classes/`)
      .pipe<Class[]>( tap( c => this.setClasses(c) ))
  }
  getSingleByUser(classId:number) : Class|undefined{
    return this.classes[classId]
  }
}
