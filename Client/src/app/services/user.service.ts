import { Injectable } from '@angular/core';
import { Constants } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URL : string = Constants.API_VERSION + '/users'
  constructor(private http : HttpClient) { }
  getAll(filter : string|undefined) : Observable<User[]> {
    return this.http.get<User[]>(this.URL+'?username='+filter)
  }
  getOne(uid : string) : Observable<User> {
    return this.http.get<User>(this.URL+'/'+uid)
  }
  create(name : string) : Observable<User> {
    return this.http.post<User>(this.URL, name)
  }
  update(user : User) : Observable<User> {
    return this.http.put<User>(this.URL+"/"+user.userName,user)
  }
}
