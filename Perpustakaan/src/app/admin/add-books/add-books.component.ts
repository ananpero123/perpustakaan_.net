import { Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Books, Categorybooks } from 'src/app/Model/model';
import { ConnectionsService } from 'src/app/Services/connections.service';

@Component({
  selector: 'app-add-books',
  templateUrl: './add-books.component.html',
  styleUrls: ['./add-books.component.css'],
})
export class AddBooksComponent implements OnInit {
  bookdata: Books = {
    IsAvailable: true,
    id:0,
    title: '',
    author: '',
    namapenerbit: '',
    categoryId: 0,
    foto: '',
    isbn: '',
  };
  Category: Categorybooks[] = [];
  ngOnInit(): void {
    this.loadCategories();
  }

  constructor(
    private connectionService: ConnectionsService,
    private go: Router
  ) {}

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

  saveBook(): void {
    this.connectionService.insertBook(this.bookdata).subscribe(
      () => {
        this.go.navigate(['admin/books']);
        alert('Book successfully added');
      },
      (error) => {
        console.error('Error adding book:', error);
      }
    );
  }

  loadCategories(): void {
    this.connectionService.getCategories().subscribe(
      (categories) => {
        this.Category = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }
}
