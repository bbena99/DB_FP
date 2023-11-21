import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
//@ts-ignore
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    return this.authService.isUser();
  }
}
/*
var authService:AuthService;

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot,state: RouterStateSnapshot):
  Observable<boolean|UrlTree> |
  Promise<boolean|UrlTree> |
  boolean |
  UrlTree => {
    let bool = false;
    authService.getAuthenticatedUser().subscribe((u)=>{
      if(u)bool=true
    })
    return bool
  };
*/
