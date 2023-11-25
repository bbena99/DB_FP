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

  constructor(
    private http : HttpClient,
    ) { }

  //Start of internal function calls

  //Start of external function calls
  getAllByUser(user:Student|Teacher) : Observable<Class[]>|undefined{
    const API = this.URL+"/classes"
    let id : Number
    if('SId' in user)id = user.SId
    else if('TId' in user)id = user.TId
    else{
      console.error("ERROR: Invalid credentials passed into getAllByUser(user:Student|Teacher) in class.service.ts")
      return undefined
    }
    return this.http
      .get<Class[]>(API+`?id=${id}`)
      .pipe<Class[]>( tap( c => this.classes=c))
  }
}
