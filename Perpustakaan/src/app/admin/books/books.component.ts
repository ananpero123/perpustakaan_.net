import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Books, Categorybooks } from 'src/app/Model/model';
import { ConnectionsService } from 'src/app/Services/connections.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  categories: any[] = [];
  constructor(private connect: ConnectionsService, private go: Router) {}

  Category: Categorybooks[] = [];
  ngOnInit(): void {
    this.loadCategories();
    this.loadBooks();
  }

  loadBooks(): void {
    // Panggil service untuk mendapatkan data buku
    this.connect.getBooks().subscribe(
      (books) => {
        this.books = books;
      },
      (error) => {
        console.error('Error loading books:', error);
      }
    );
  }

  loadCategories(): void {
    // Panggil service untuk mendapatkan data kategori
    this.connect.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.category : '';
  }

  selectedBook: Books | null = null; // Variabel untuk menyimpan buku yang akan dihapus

  confirmDelete(book: Books): void {
    this.go.navigate(['admin/books']);
    this.selectedBook = book;

  }

  deleteConfirmed(): void {
    if (this.selectedBook) {
      this.connect.deleteBook(this.selectedBook.id).subscribe(
        () => {
          console.log('Book deleted successfully');
           location.reload();

          this.loadBooks();
        },
        (error) => {
          console.error('Error deleting book:', error);
        }
      );
    }
    this.selectedBook = null; // Mengatur kembali buku yang akan dihapus menjadi null
  }
}
