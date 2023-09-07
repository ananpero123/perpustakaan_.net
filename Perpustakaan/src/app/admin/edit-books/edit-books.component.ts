import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Books, Categorybooks } from 'src/app/Model/model';
import { ConnectionsService } from 'src/app/Services/connections.service';

@Component({
  selector: 'app-edit-books',
  templateUrl: './edit-books.component.html',
  styleUrls: ['./edit-books.component.css'],
})
export class EditBooksComponent implements OnInit {
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

  bookCategories: Categorybooks[] = [];

  constructor(
    private route: ActivatedRoute,
    private Connect: ConnectionsService,
    private go: Router
  ) {}

  ngOnInit(): void {
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

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.bookdata.foto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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

  updateBook(): void {
    this.Connect.updateBook(this.bookdata).subscribe(
      (response) => {
        this.go.navigate(['admin/books']);
        console.log('Book updated successfully:', response);
      },
      (error) => {
        console.error('Error updating book:', error);
      }
    );
  }
}
