import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Usertype } from '../Model/model';
import { ConnectionsService } from '../Services/connections.service';

@Injectable({
  providedIn: 'root',
})
export class ProtectGuard implements CanActivate {
  constructor(
    private connectionService: ConnectionsService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.connectionService.isLggedin()) {
      const user = this.connectionService.takesTken();
      if (user?.usertype === Usertype.ADMIN && state.url.includes('/admin')) {
        return true;
      } else if (
        user?.usertype === Usertype.USER &&
        state.url.includes('/users')
      ) {
        return true;
      } else if (
        user?.usertype === Usertype.ADMIN &&
        state.url.includes('/save_book')
      ) {
        return true;
      } else if (
        user?.usertype === Usertype.USER &&
        state.url.includes('/save_book')
      ) {
        return true;
      }
    }
    alert("Please Login or register if you want to borrow a book ");
    this.router.navigate(['/login']);

    return false;
  }
}
