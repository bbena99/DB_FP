import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Class } from '../models/class';
import { Teacher } from '../models/teacher';
import { Student } from '../models/student';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  //Variables
  private URL : string = Constants.API_VERSION
  private classes : Class[] = []
  private class! : Class

  constructor(
    private http : HttpClient,
  ) { }

  //Start of internal function calls

  //Start of external function calls
  createClass(user:Teacher,newClass:Class) : Observable<Class>|undefined {
    return this.http
      .post<Class>(this.URL+`/User/${user.Username}/Classes`,newClass)
      .pipe<Class>( tap( c => this.class=c ))
  }
  getAllByUser(user:Student|Teacher) : Observable<Class[]>|undefined{
    return this.http
      .get<Class[]>(this.URL+`/User/${user.Username}/Classes`)
      .pipe<Class[]>( tap( c => this.classes=c ))
  }
  getSingleByUser(user:Student|Teacher,classId:number) : Observable<Class>|undefined{
    return this.http
      .get<Class>(this.URL+`/User/${user.Username}/Classes/${classId}`)
      .pipe<Class>( tap( c => this.class=c ))
  }
}
