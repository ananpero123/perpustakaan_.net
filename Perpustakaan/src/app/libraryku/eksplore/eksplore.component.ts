import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from 'src/app/Services/connections.service';

@Component({
  selector: 'app-eksplore',
  templateUrl: './eksplore.component.html',
  styleUrls: ['./eksplore.component.css']
})
export class EksploreComponent implements OnInit {

constructor(private Api: ConnectionsService,private go: Router,private active: ActivatedRoute) {}

searchTerm: string = '';
books: any[] = [];
selectedCategory: string = 'All'; // Nilai default
categories: any[] = [];
ngOnInit(): void {
  this.loadCategories();
  this.loadBooks();
}

loadBooks(): void {

  this.Api.getBooks().subscribe(
    (books) => {
      this.books = books;
    },
    (error) => {
      console.error('Error loading books:', error);
    }
  );
}

loadBookss(searchTerm: string): void {


  this.Api.searchBooks(searchTerm).subscribe(
    (books) => {
      this.books = books;
    },
    (error) => {
      console.error('Error loading books:', error);
    }
  );
}


filterByCategory(): void {
  if (this.selectedCategory === 'All') {
    this.loadBookss(this.searchTerm);
    // Jika kategori yang dipilih adalah "All", tampilkan semua buku
    this.loadBooks();
  } else {
    // Jika kategori yang dipilih bukan "All", filter buku berdasarkan kategori
    this.Api.getBooksByCategory(this.selectedCategory).subscribe(
      (books) => {

      },
      (error) => {
        console.error('Error loading books by category:', error);
      }
    );
  }
}






onSearch(): void {
  this.loadBookss(this.searchTerm);
}











getLatestBooks() {
  const startIndex = this.books.length - 5 >= 0 ? this.books.length - 5 : 0;
  return this.books.slice(startIndex);
}

loadCategories(): void {

  this.Api.getCategories().subscribe(
    (categories) => {
      this.filterByCategory();
      this.categories = categories;

    },
    (error) => {
      console.error('Error loading categories:', error);
    }
  );
}

getBooksInCategory(categoryId: number): any[] {
  return this.books.filter(book => book.categoryId === categoryId);
}





}
