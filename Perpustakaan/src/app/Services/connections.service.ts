import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookLoan, Books, BooksLoan, Categorybooks, Orders, User, Usertype } from '../Model/model';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConnectionsService  {
  baseUrl = 'https://localhost:7041/api/RoleBaseAuth/';
  constructor(private http: HttpClient, private jwts: JwtHelperService) {}

  Regis(user: User) {
    return this.http.post(this.baseUrl + 'Register', user, {
      responseType: 'text',
    });
  }

  Logins(login: any) {
    let params = new HttpParams()
      .append('email', login.email)
      .append('password', login.password);

    return this.http.get(this.baseUrl + 'Logins', {
      params: params,
      responseType: 'text',
    });
  }

  Nyimpantoken(token: string) {
    localStorage.setItem('access_token', token);
  }

  logout() {
    localStorage.removeItem('access_token');
  }
  isLggedin(): boolean {
    return !!localStorage.getItem('access_token');
  }

  takesTken(): User | null {
    if (!this.isLggedin()) return null;
    let token = this.jwts.decodeToken();
    let user: User = {
      id: token.id,
      Firstname: token.Firstname,
      Lastname: token.Lastname,
      Address: token.Address,
      Mobile: token.Mobile,
      Username: token.Username,
      Email: token.Email,
      Image: '',
      Password: token.Password,
      createdon: token.createdAt,
      usertype: token.userType === 'USER' ? Usertype.USER : Usertype.ADMIN,
    };
    return user;
  }

  insertBook(newBook: Books): Observable<any> {
    return this.http.post(this.baseUrl + 'AddBook', newBook, {
      responseType: 'text',
    });
  }

  getCategories(): Observable<Categorybooks[]> {
    return this.http.get<Categorybooks[]>(this.baseUrl + 'GetCategories');
  }

  getBooks(): Observable<Books[]> {
    return this.http.get<Books[]>(`${this.baseUrl}GetBooks`);
  }

  getBookById(id: number): Observable<Books> {
    return this.http.get<Books>(`${this.baseUrl}GetBookById/${id}`);
  }

  updateBook(updatedBook: Books): Observable<any> {
    return this.http.put(
      `${this.baseUrl}UpdateBook/${updatedBook.id}`,
      updatedBook
    );
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}DeleteBook/${bookId}`)
      .pipe(
        catchError((error) => {
          console.error('Error deleting book:', error);
          throw error;
        })
      );
  }


  updateusers(updatedusers: User): Observable<any> {
    return this.http.put(
      `${this.baseUrl}UpdateUserInfo/${updatedusers.id}`,
      updatedusers
    );
  }

  getUserProfile(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}GetUserProfile/${userId}`);
  }

  borrowBook(bookId: number, returnDate: string): Observable<any> {
    const userId = this.GetUserIdFromToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });
    const url = `${this.baseUrl}BorrowBook/${userId}/${bookId}`;

    // Pastikan returnDate sudah memiliki nilai yang sesuai
    if (returnDate) {
      // Mengonversi returnDate ke objek Date dan kemudian ke string ISO
      const returnDateISO = new Date(returnDate).toISOString();
      // Membuat objek yang berisi tanggal pengembalian
      const data = { returnDate: returnDateISO };

      return this.http.post(url, data, { headers })
        .pipe(
          catchError((error) => {
            console.error('Error borrowing book:', error);
            throw error;
          })
        );
    } else {
      // Tampilkan pesan kesalahan jika returnDate kosong atau tidak valid
      console.error('Invalid return date');
      throw new Error('Invalid return date');
    }
  }





  getUserBookLoans(userId: number): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(`${this.baseUrl}GetUserBookLoans/${userId}`);
  }
  getUsersBookLoans(): Observable<BooksLoan[]> {
    return this.http.get<BooksLoan[]>(`${this.baseUrl}GetUserBookLoan`);
  }


  confirmBorrow(bookLoanId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}ConfirmBorrow/${bookLoanId}`, null);
  }

  deleteBookLoan(bookLoanId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}DeleteBookLoan/${bookLoanId}`)
      .pipe(
        catchError((error) => {
          console.error('Error deleting book loan:', error);
          throw error;
        })
      );
  }



searchBooks(searchTerm: string): Observable<Books[]> {
  return this.http.get<Books[]>(`${this.baseUrl}SearchBooks?searchTerm=${searchTerm}`);
}

getBooksByCategory(categoryName: string): Observable<Books[]> {
  return this.http.get<Books[]>(`${this.baseUrl}GetBooksByCategory/${categoryName}`);
}














  private GetUserIdFromToken(): number | null {
    const token = localStorage.getItem('access_token');

    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload.id) {
          return +payload.id; // Mengonversi ID menjadi tipe number
        }
      }
    }

    return null; // Token tidak ada atau tidak valid
  }



  returnBook(bookId: number): Observable<any> {
    const userId = this.GetUserIdFromToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });

    const url = `${this.baseUrl}ReturnBook/${userId}/${bookId}`;

    return this.http.post(url, null, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error returning book:', error);
          throw error;
        })
      );
  }






}












