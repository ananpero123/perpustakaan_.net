import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from '../Services/connections.service';
import { Router } from '@angular/router';
import { BookLoan, User } from '../Model/model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  bookLoans: BookLoan[] = [];
  imageBase64: string | null = null; // Store the base64 encoded image data
  user: User | null = null;

  constructor(
    private connectionService: ConnectionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.GetUserIdFromToken();
    if (userId) {
      this.connectionService.getUserBookLoans(userId).subscribe((loans) => {
        this.bookLoans = loans.map(this.mapBookLoanStatus);
      });
    }
    this.loadUsersProfile();
    this.loadUserProfile();
  }

  logout(): void {
    this.router.navigate(['login']);
    this.connectionService.logout();
  }

  loadUsersProfile(): void {
    this.user = this.connectionService.takesTken();
  }

  private GetUserIdFromToken(): number | null {
    const token = localStorage.getItem('access_token');

    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload.id) {
          return +payload.id; // Mengonversi ID menjadi tipe number
        }
      }
    }

    return null; // Token tidak ada atau tidak valid
  }


  private mapBookLoanStatus(loan: BookLoan): BookLoan {
    return {
      ...loan,
      isPending: loan.status,
      statusText: loan.status ? 'Pending' : 'Confirm', // Ubah boolean status ke teks
    };
  }


  loadUserProfile() {
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






}
