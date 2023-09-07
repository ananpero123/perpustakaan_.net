import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-save-book',
  templateUrl: './save-book.component.html',
  styleUrls: ['./save-book.component.css']
})
export class SaveBookComponent implements OnInit {
[x: string]: any;
returnDate: any;
saveOrders() {
throw new Error('Method not implemented.');
}
  bookId: string | null = null;
  bookData: any = {
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    category: '',
    coverImage: null
  };

  constructor(private firestore: Firestore, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.bookId = params.get('id');
      if (this.bookId) {
        this.loadBookData(this.bookId);
      }
    });
  }

  loadBookData(bookId: string): void {
    const docRef = doc(this.firestore, 'book', bookId);

    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          this.bookData = docSnap.data();
        } else {
          console.log('Document not found');
        }
      })
      .catch((error) => {
        console.error('Error getting document:', error);
      });
  }
}
