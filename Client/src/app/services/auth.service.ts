import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants/constants';
import { User } from '../models/user';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL : string = Constants.API_VERSION
  private user : User | undefined;
  public userSubject : BehaviorSubject<User|undefined> = new BehaviorSubject<User|undefined>( undefined )
  constructor(private http : HttpClient) {
    this.ngOnInit()
  }
  ngOnInit(){
    this.getAuthenticatedUser().subscribe()
  }
  //Start of internal function calls
  getAuthenticatedUser() : Observable<User> {
    let localUser = window.localStorage.getItem('user')
    if(localUser){
      let user : User = JSON.parse( localUser as string ) as User
      this.setUser( user )
      return of(user)
    } else {
      return this.fetchUser()
    }
  }
  setUser(user : User | undefined ): void {
    this.user = user
    if (this.user){
      window.localStorage.setItem('user', JSON.stringify( user ))
    } else {
      window.localStorage.removeItem('user')
    }
    this.userSubject.next( user )
  }
  fetchUser() : Observable<User> {
    return this.http.get<User>(this.URL + "/who").pipe(tap(user=>{
      this.setUser(user)
    }))
  }

  //Start of main external function calls w/ backend calls.
  login( username : string, password : string ) : Observable<User> {
    const API = this.URL + "/login"
    let credentials = '?username='+username+"&password="+password
    return this.http
      .post<User>( API+credentials,undefined)
      .pipe<User>( tap( u => this.setUser( u ) ) )
    }
  createUser( username : string, password : string ) : Observable<User> {
    const API = this.URL + "/createUser"
    let credentials = '?username='+username+"&password="+password
    return this.http
      .post<User>( API+credentials,undefined)
      .pipe<User>( tap( u => this.setUser( u ) ) )
  }
  logout() {
    const API = this.URL+"/logout"
    return this.http
    .post<User>(API,{})
      .pipe( tap( ()=>this.setUser(undefined) ) )
  }
  isUser(username:string):boolean{
    if(this.getAuthenticatedUser())return true
    let tempUser:User|undefined
    this.http.get<User>('/users/')
      .pipe( tap( user => tempUser = user ) )
    if(tempUser)return true
    return false
  }
}
