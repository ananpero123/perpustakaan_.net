import { Component, OnInit } from '@angular/core';
import { Books } from 'src/app/Model/model';
import { ConnectionsService } from 'src/app/Services/connections.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  books: any[] = [];
  constructor(private koneksi: ConnectionsService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    // Panggil service untuk mendapatkan data buku
    this.koneksi.getBooks().subscribe(
      (books) => {
        this.books = books;
      },
      (error) => {
        console.error('Error loading books:', error);
      }
    );
  }


  getLatestBooks() {
    const startIndex = this.books.length - 4 >= 0 ? this.books.length - 4 : 0;
    return this.books.slice(startIndex);
  }

}
