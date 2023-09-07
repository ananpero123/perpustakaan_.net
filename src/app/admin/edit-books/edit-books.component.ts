  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute } from '@angular/router'; 
  import { Firestore, collection, doc, getDoc, updateDoc } from '@angular/fire/firestore'; 
  import { AngularFireStorage } from '@angular/fire/compat/storage';
  import { finalize } from 'rxjs';

  @Component({
    selector: 'app-edit-books',
    templateUrl: './edit-books.component.html',
    styleUrls: ['./edit-books.component.css']
  })
  export class EditBooksComponent implements OnInit {
    isLoading: boolean = false;
    bookId: string | null = null;
    bookData: any = {
      title: '',
      author: '',
      publisher: '',
      isbn: '',
      category: '',
      coverImage: null,
      bookPdf: null
    };

    constructor(
      private firestore: Firestore,
      private storage: AngularFireStorage,
      private route: ActivatedRoute
    ) {}

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

    updateBook(): void {
      if (this.bookId) {
        const docRef = doc(this.firestore, 'book', this.bookId);
        const collectionInstance = collection(this.firestore, 'book');
    
        // Tampilkan spinner
        this.isLoading = true;
    
        if (this.bookData.bookPdf) {
          const storagePath = `${this.bookData.title}_${new Date().getTime()}.pdf`;
          const pdfRef = this.storage.ref(storagePath);
    
          pdfRef.put(this.bookData.bookPdf)
            .snapshotChanges()
            .pipe(
              finalize(() => {
                pdfRef.getDownloadURL().subscribe((pdfUrl) => {
                  console.log('PDF URL:', pdfUrl);
                  this.bookData.bookPdf = pdfUrl;
                  updateDoc(docRef, this.bookData)
                    .then(() => {
                      console.log('Book updated successfully');
                      // Sembunyikan spinner setelah selesai menyimpan data
                      this.isLoading = false;
                    })
                    .catch((error) => {
                      console.error('Error updating document:', error);
                      // Sembunyikan spinner jika ada kesalahan
                      this.isLoading = false;
                    });
                });
              })
            ).subscribe();
        } else {
          updateDoc(docRef, this.bookData)
            .then(() => {
              console.log('Book updated successfully');
              // Sembunyikan spinner setelah selesai menyimpan data
              this.isLoading = false;
            })
            .catch((error) => {
              console.error('Error updating document:', error);
              // Sembunyikan spinner jika ada kesalahan
              this.isLoading = false;
            });
        }
      }
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
        // Ambil file PDF
        this.bookData.bookPdf = file;
      }
    }
  }
