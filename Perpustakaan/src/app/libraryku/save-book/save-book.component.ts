import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Books, Categorybooks } from 'src/app/Model/model';
import { ConnectionsService } from 'src/app/Services/connections.service';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-save-book',
  templateUrl: './save-book.component.html',
  styleUrls: ['./save-book.component.css'],
})
export class SaveBookComponent implements OnInit {
  returnDate: string = '';

  bookCategories: Categorybooks[] = [];

  constructor(
    private Connect: ConnectionsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private go: Router
  ) {}
  categories: any[] = [];

  bookdata: Books = {
    IsAvailable: true,
    id: 0,
    title: '',
    author: '',
    namapenerbit: '',
    categoryId: 0,
    foto: '',
    isbn: '',
  };

  ngOnInit(): void {
    this.loadCategories();
    this.route.params.subscribe((params) => {
      const bookId = +params['id'];
      this.getBookDetails(bookId);
    });

    this.Connect.getCategories().subscribe(
      (categories: Categorybooks[]) => {
        this.bookCategories = categories;
      },
      (error) => {
        console.error('Error fetching book categories:', error);
      }
    );
  }

  loadCategories(): void {
    // Panggil service untuk mendapatkan data kategori
    this.Connect.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return formatDate(currentDate, 'yyyy-MM-dd', 'en');
  }

  minReturnDate(): string {
    const today = new Date();
    
    today.setDate(today.getDate() + 1);

    const minDate = today.toISOString().split('T')[0];
    return minDate;
}


  getBookDetails(bookId: number): void {
    this.Connect.getBookById(bookId).subscribe(
      (book: Books) => {
        this.bookdata = book;
      },
      (error) => {
        console.error('Error fetching book details:', error);
      }
    );
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.category : '';
  }

  borrowBook(bookId: number): void {
    // Ambil tanggal pengembalian dari returnDate
    const returnDateISO = this.returnDate.toString();
    this.Connect.borrowBook(bookId, returnDateISO).subscribe(
      (response) => {
        alert('Success borrow a book, please wait for the confirmation to borrow ^-^');
      },
      (error) => {
        this.toastr.error('Failed to borrow book', 'Error');
        console.error('Error borrowing book:', error);
      }
    );
}



  returnBook(bookId: number): void {
    this.Connect.returnBook(bookId).subscribe(
      (response) => {
        this.toastr.success(response, 'Success');
        // Lakukan tindakan yang sesuai setelah pengembalian berhasil
      },
      (error) => {
        this.toastr.error('Failed to return book', 'Error');
        console.error('Error returning book:', error);
      }
    );
  }
}
