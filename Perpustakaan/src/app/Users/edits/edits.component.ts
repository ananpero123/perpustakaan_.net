import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionsService } from 'src/app/Services/connections.service';

@Component({
  selector: 'app-edits',
  templateUrl: './edits.component.html',
  styleUrls: ['./edits.component.css'],
})
export class EditsComponent implements OnInit {
  user: any = {};

  constructor(private Api: ConnectionsService, private go: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.user = this.Api.takesTken();
  }

  updateUserInfo(): void {
    this.Api.updateusers(this.user).subscribe(
      (response) => {
        this.Api.logout();
        this.go.navigate(['Libraryku/home']);
        alert('Update Successfull,Auto Logout to save the data ^-^');
        console.log(response);
      },
      (error) => {
        console.error('Error updating user info:', error);
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.Image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
