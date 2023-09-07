import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usertype } from 'src/app/Model/model';
import { ConnectionsService } from 'src/app/Services/connections.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  constructor(private sambung: ConnectionsService, private go: Router) {}

  isLoggedIn(): boolean {
    return this.sambung.isLggedin();
  }

  logout() {
    this.go.navigate(['login']);
    this.sambung.logout();
  }

  isAdmin(): boolean {
    const user = this.sambung.takesTken();
    return user !== null && user.usertype === Usertype.ADMIN;
  }

}
