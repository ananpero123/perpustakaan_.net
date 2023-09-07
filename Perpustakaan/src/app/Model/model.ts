export interface SidenavItem {
  title: 'string';
  link: 'string';
}

export enum Usertype {
  ADMIN,
  USER,
}

export interface User {
  id: number;
  Firstname: string;
  Lastname: string;
  Username: string;
  Email: string;
  Address: string;
  Password: string;
  Mobile: string;
  Image: string;
  createdon: string;
  usertype: Usertype;
}

export interface Book {
  title: string;
  author: string;
  foto: string;
  ISBN: string;
  namapenerbit: string;
  categoryId: number;
}
export interface Books {
  id: number;
  IsAvailable: true;
  title: string;
  author: string;
  foto: string;
  isbn: string;
  namapenerbit: string;
  categoryId: number;
}

export interface Categorybooks {
  id: number;
  category: string;
  Category: string;
}

export interface Orders {
  UserId: number;
  BookId: number;
  returndate: Date;
  borrowdate: string;
}

export interface BookLoan {
  id: number;
  bookTitle: string;
  namapenerbit: string;
  isbn: string;
  author: string;
  category: string;
  status: boolean;
  returnDate: string;
  remainingDays: number;
  isPending: boolean;
  statusText: string;
}
export interface BooksLoan {
  id: number;
  bookTitle: string;
  email: string;
  username: string;
  notifRead: boolean;
  statusText: string;
  status: boolean;
  isPending: boolean;
  namapenerbit: string;
  isbn: string;
  notifs: boolean;
  author: string;
  category: string;
  isCLicked: boolean;
  remainingDays: number;
  returnDate: string;
  borrowdate: string;
}

export interface yoyo {
  Id: number;
}
