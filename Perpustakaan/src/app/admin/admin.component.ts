import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from '../Services/connections.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'
import { BooksLoan, User } from '../Model/model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  imageBase64: string | null = null; // Store the base64 encoded image data
  user: User | null = null;
  userBookLoans: BooksLoan[] = [];
  readNotifications: any[] = [];


  constructor(private connectionService: ConnectionsService, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadUsersProfile();
    this.loadUserProfile();
    this.loadUserBookLoans();
  }

  logout(): void {
    this.router.navigate(['login']);
    this.connectionService.logout();
  }

  loadUserBookLoans() {
    this.connectionService.getUsersBookLoans().subscribe(
      (loans: BooksLoan[]) => {
        this.userBookLoans = loans;
        this.userBookLoans.forEach((loan) => {
          loan.borrowdate = loan.borrowdate.split('T')[0];
        });
        this.userBookLoans.forEach((loan) => {
          loan.returnDate = loan.returnDate.split('07:')[0];
        });
      },
      (error) => {
        console.error('Error fetching user book loans:', error);
      }
    );
  }

  loadUsersProfile() {
    const accessData = localStorage.getItem('access_token'); // Ini berisi data yang mengandung URL gambar dan token

    if (accessData) {
      const accessObject = JSON.parse(accessData); // Parse data menjadi objek

      if (accessObject && accessObject.image) {
        // Mengubah gambar menjadi base64 dan menyimpannya
        this.getImageAsBase64(accessObject.image).then((base64Data) => {
          this.imageBase64 = base64Data;
        });
      }
    }
  }

  markNotificationAsRead(notification: BooksLoan): void {

    notification.notifRead = true;


    const index = this.userBookLoans.findIndex(loan => loan.id === notification.id);
    if (index !== -1) {
      this.userBookLoans.splice(index, 1);
    }


  }




  // Fungsi untuk mengambil gambar dalam bentuk base64
  async getImageAsBase64(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        const base64Data = canvas.toDataURL('image/png'); // Menyimpan dalam format base64
        resolve(base64Data);
      };
      img.onerror = function (error) {
        reject(error);
      };
      img.src = url;
    });
  }

  loadUserProfile(): void {
    this.user = this.connectionService.takesTken();
  }
}
