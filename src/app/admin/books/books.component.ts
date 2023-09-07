import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  title = 'perpustakaan';
  bookData!: Observable<any[]>;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    const collectionInstance = collection(this.firestore, 'book');
    this.bookData = collectionData(collectionInstance, { idField: 'id' });
  }

  deleteBook(bookId: string) {
    const docRef = doc(this.firestore, 'book', bookId);
    deleteDoc(docRef)
      .then(() => {
        console.log('Book deleted successfully');
        this.getData();
        location.reload(); 
      })
      .catch((error) => {
        console.error('Error deleting book:', error);
      });
  }


}
