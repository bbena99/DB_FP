import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

var authService:AuthService;

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot,state: RouterStateSnapshot):
  Observable<boolean|UrlTree> |
  Promise<boolean|UrlTree> |
  boolean |
  UrlTree => {
    //console.warn("Here");
    return authService.isUser()
  };
