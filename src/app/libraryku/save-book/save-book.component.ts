import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, collection, addDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

@Component({
  selector: 'app-save-book',
  templateUrl: './save-book.component.html',
  styleUrls: ['./save-book.component.css']
})
export class SaveBookComponent implements OnInit {
  bookId: string | null = null;
  imageProfile: string | undefined;

  bookData: any = {
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    category: '',
    coverImage: null
  };

  borrowDate: string = '';   // Store the selected borrow date
  returnDate: string = '';   // Store the selected return date
  canEditBorrowDate: boolean = false; // Tambah properti untuk mengontrol pengeditan tanggal pinjam

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private auth: AngularFireAuth,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.bookId = params.get('id');
      const currentDate = new Date();
      this.borrowDate = this.convertToUTC7ISOString(currentDate); // Setel tanggal dan waktu saat ini
      this.returnDate = ''; // Kosongkan tanggal kembali

      // Tambahkan kondisi untuk mengatur apakah tanggal pinjam dapat diubah atau tidak
      if (this.bookId) {
        this.loadBookData(this.bookId);
        this.canEditBorrowDate = true; // Izinkan pengeditan jika ada buku
      }
    });
  }

  get formattedDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadBookData(bookId: string): void {
    const docRef = doc(this.firestore, 'book', bookId);

    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          this.bookData = docSnap.data();
        } else {
          console.log('Dokumen tidak ditemukan');
        }
      })
      .catch((error) => {
        console.error('Kesalahan saat mengambil dokumen:', error);
      });
  }

  onBorrowDateChange(event: any) {
    this.borrowDate = event.target.value;

  }

  onReturnDateChange(event: any) {
    this.returnDate = event.target.value;
  }

  getMinReturnDate(): string {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Setel tanggal minimum untuk besok
    return currentDate.toISOString().slice(0, 10); // Format sebagai YYYY-MM-DD
  }


  doBorrowBook(): void {
    this.auth.currentUser.then(user => {
      if (user) {
        const userDocRef = doc(this.firestore, 'users', user.uid);

        getDoc(userDocRef)
          .then((userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();

              // Ambil data imageProfile dari userData
              const imageProfile = userData?.['imageProfile'] || '';

              const orderData = {
                username: userData['username'],
                email: user.email,
                imageProfile: imageProfile,
                bookTitle: this.bookData.title,
                author: this.bookData.author,
                publisher: this.bookData.publisher,
                isbn: this.bookData.isbn,
                bookPdf: this.bookData.bookPdf,
                category: this.bookData.category,
                loanDate: this.convertToUTC7ISOString(new Date(this.formattedDate)),
                returnDate: this.convertToUTC7ISOString(new Date(this.returnDate)),
                status: 'pending'
              };

              const ordersCollection = collection(this.firestore, 'orders');
              addDoc(ordersCollection, orderData)
                .then(() => {
                  console.log('Data peminjaman berhasil disimpan:', orderData);
                  this.router.navigate(['../../admin/my_orders']);
                })
                .catch(error => {
                  console.error('Kesalahan saat menyimpan data peminjaman:', error);
                });
            } else {
              console.log('Dokumen pengguna tidak ditemukan');
            }
          })
          .catch(error => {
            console.error('Kesalahan saat mengambil dokumen pengguna:', error);
          });
      }
    }).catch(error => {
      console.error('Kesalahan saat mendapatkan pengguna:', error);
    });
  }

  convertToUTC7ISOString(date: Date): string {
    const timeZone = 'Asia/Bangkok'; // Zona waktu UTC+7
    const zonedDate = utcToZonedTime(date, timeZone);
    const isoString = zonedDate.toISOString();
    return isoString;
  }
}
