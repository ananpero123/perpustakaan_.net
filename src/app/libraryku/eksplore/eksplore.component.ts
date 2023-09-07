import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

interface Book {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  coverImage: string;
  id: string; // Menambahkan properti id dari Firestore
}

@Component({
  selector: 'app-eksplore',
  templateUrl: './eksplore.component.html',
  styleUrls: ['./eksplore.component.css']
})
export class EksploreComponent implements OnInit {
  booksByCategory: { [category: string]: Book[] } = {}; // Menggunakan tipe Book[]
  selectedCategory: string = 'All';
  searchTitle: string = '';

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.getBooksByCategory();
  }

  async getBooksByCategory() {
    const booksRef = collection(this.firestore, 'book');
    const querySnapshot = await getDocs(booksRef);
    const allBooks: Book[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as Book;
        return { ...data, id: doc.id };
    });

    console.log('getBooksByCategory() dipanggil');

    const filteredBooks = allBooks.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(this.searchTitle.toLowerCase());
        const categoryMatch = this.selectedCategory === 'All' || book.category === this.selectedCategory;
        return titleMatch && categoryMatch;
    });

    this.booksByCategory = {};

    if (this.searchTitle.trim() !== '' || this.selectedCategory !== 'All') {
        filteredBooks.forEach(book => {
            const category = book.category;
            if (!this.booksByCategory[category]) {
                this.booksByCategory[category] = [];
            }
            this.booksByCategory[category].push(book);
        });
    } else {
        // Jika tidak ada pencarian atau kategori dipilih
        const latestBooks = filteredBooks.sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5); // Mengurutkan dari terbaru ke terlama
        this.booksByCategory = {
            'Novel': filteredBooks.filter(book => book.category === 'Novel'),
            'Comic': filteredBooks.filter(book => book.category === 'Comic'),
            'Lesson': filteredBooks.filter(book => book.category === 'Lesson'),
            'Latest': latestBooks
        };
    }
}


  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.getBooksByCategory();
  }
}
