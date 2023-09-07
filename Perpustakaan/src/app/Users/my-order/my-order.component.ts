import { Component, OnInit } from '@angular/core';
import { BookLoan, BooksLoan } from 'src/app/Model/model';
import { ConnectionsService } from 'src/app/Services/connections.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css'],
})
export class MyOrderComponent implements OnInit {
  bookLoans: BookLoan[] = [];

  constructor(private connectionsService: ConnectionsService) {}

  ngOnInit(): void {


    const userId = this.GetUserIdFromToken();
    if (userId) {
      this.connectionsService.getUserBookLoans(userId).subscribe((loans) => {
        this.bookLoans = loans.map(this.mapBookLoanStatus);
      });
    }
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


}
