import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  booksByCategory: { [category: string]: any[] } = {}; 
  selectedCategory: string = 'All';

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.getBooksByCategory();
  }

  async getBooksByCategory() {
    const booksRef = collection(this.firestore, 'book');
    const querySnapshot = await getDocs(booksRef);
    const allBooks = querySnapshot.docs.map(doc => doc.data());

    this.booksByCategory = {
      'Novel': [],
      'Comic': [],
      'Lesson': [],
      'Latest': allBooks 
    };

    allBooks.forEach(book => {
      const category = book['category'];
      this.booksByCategory[category].push(book);
    });
  }

  getLatestBooks(): any[] {
    const latestBooks = this.booksByCategory['Latest'] ? this.booksByCategory['Latest'].slice() : [];
    return latestBooks.reverse().slice(0, 5);
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
  }
}
