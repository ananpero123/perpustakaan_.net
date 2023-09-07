import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-books',
  templateUrl: './add-books.component.html',
  styleUrls: ['./add-books.component.css']
})
export class AddBooksComponent {
  title = 'perpustakaan';
  bookData = {
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    category: '',
    coverImage: null,
    bookPdf: null
  };
  isLoading: boolean = false;


  constructor(private firestore: Firestore, private storage: AngularFireStorage) {}

  addBook() {
    this.isLoading = true; // Set loading to true
  
    const collectionInstance = collection(this.firestore, 'book');
  
    if (this.bookData.bookPdf) {
      const storagePath = `${this.bookData.title}_${new Date().getTime()}.pdf`;
      const pdfRef = this.storage.ref(storagePath);
  
      pdfRef.putString(this.bookData.bookPdf, 'base64', { contentType: 'application/pdf' })
        .snapshotChanges()
        .pipe(
          finalize(() => {
            pdfRef.getDownloadURL().subscribe((pdfUrl) => {
              console.log('PDF URL:', pdfUrl);
              this.bookData.bookPdf = pdfUrl;
              addDoc(collectionInstance, this.bookData)
                .then(() => {
                  console.log('Book added successfully');
                  this.isLoading = false; // Set loading to false after success
                  this.resetForm();
                })
                .catch((err) => {
                  console.error('Error adding book:', err);
                  this.isLoading = false; // Set loading to false after error
                });
            });
          })
        ).subscribe();
    } else {
      addDoc(collectionInstance, this.bookData)
        .then(() => {
          console.log('Book added successfully');
          this.isLoading = false; // Set loading to false after success
          this.resetForm();
        })
        .catch((err) => {
          console.error('Error adding book:', err);
          this.isLoading = false; // Set loading to false after error
        });
    }
  }
  
  
  resetForm() {
    this.bookData = {
      title: '',
      author: '',
      publisher: '',
      isbn: '',
      category: '',
      coverImage: null,
      bookPdf: null
    };
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Buat path unik untuk gambar menggunakan judul buku
      const fileName = this.bookData.title.replace(/[^a-zA-Z0-9-_]/g, '_');
      const filePath = `bookcover/${fileName}_${new Date().getTime()}`;
  
      const storageRef = this.storage.ref(filePath);
  
      // Upload gambar ke Firebase Storage
      const uploadTask = this.storage.upload(filePath, file);
  
      // Pantau status upload
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          // Ambil URL gambar yang telah diunggah
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            console.log('Download URL:', downloadURL);
            this.bookData.coverImage = downloadURL;
          });
        })
      ).subscribe();
    }
  }
  
  

  onPdfFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (typeof e.target.result === 'string') {
          const base64Data = e.target.result;
          if (base64Data.startsWith('data:application/pdf;base64,')) {
            const base64WithoutPrefix = base64Data.split(',')[1];
            this.bookData.bookPdf = base64WithoutPrefix;
          } else {
            console.error('Invalid PDF data format');
          }
        } else {
          console.error('Invalid PDF data type');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  isFormValid(): boolean {
  return (
    this.bookData.title !== '' &&
    this.bookData.author !== '' &&
    this.bookData.publisher !== '' &&
    this.bookData.isbn !== '' &&
    this.bookData.category !== '' &&
    this.bookData.coverImage !== null &&
    this.bookData.bookPdf !== null
  );
}

}