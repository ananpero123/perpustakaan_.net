import { Component, OnInit } from '@angular/core';
import { BooksLoan } from 'src/app/Model/model';
import { ConnectionsService } from 'src/app/Services/connections.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  userBookLoans: BooksLoan[] = [];


  constructor(private connectionsService: ConnectionsService) {}

  ngOnInit(): void {
    this.loadUserBookLoans();
  }


  selectedBookLoan: BooksLoan | null = null;
  showDeleteConfirmationModal(bookLoan: BooksLoan) {
  this.selectedBookLoan = bookLoan;
}

loadUserBookLoans() {
    this.connectionsService.getUsersBookLoans().subscribe(
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

  confirmBorrow(bookLoan: BooksLoan) {
    this.connectionsService.confirmBorrow(bookLoan.id).subscribe(
      (response: any) => {
        location.reload();
        alert('Borrow confirmed successfully ^-^');
        this.loadUserBookLoans(); // Refresh data setelah konfirmasi
      },
      (error) => {
        console.error('Failed to confirm borrow:', error);
      }
    );
  }



  deleteBookLoan() {
    if (this.selectedBookLoan) {
      this.connectionsService.deleteBookLoan(this.selectedBookLoan.id).subscribe(
        (response: any) => {
location.reload();
alert("This book succesfully deleted ^-^")
          this.loadUserBookLoans();
        },
        (error) => {
          console.error('Failed to delete book loan:', error);
        }
      );
    }
  }


}
