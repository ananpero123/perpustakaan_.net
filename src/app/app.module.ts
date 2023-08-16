import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibrarykuComponent } from './libraryku/libraryku.component';
import { NavComponent } from './libraryku/nav/nav.component';
import { ContactComponent } from './libraryku/contact/contact.component';
import { HomeComponent } from './libraryku/home/home.component';
import { EksploreComponent } from './libraryku/eksplore/eksplore.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SaveBookComponent } from './libraryku/save-book/save-book.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AllUsersComponent } from './admin/all-users/all-users.component';
import { BooksComponent } from './admin/books/books.component';
import { EditComponent } from './admin/edit/edit.component';
import { EditBooksComponent } from './admin/edit-books/edit-books.component';
import { AddBooksComponent } from './admin/add-books/add-books.component';
import { MyOrdersComponent } from './admin/my-orders/my-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ContactComponent,
    LibrarykuComponent,
    HomeComponent,
    EksploreComponent,
    LoginComponent,
    RegisterComponent,
    SaveBookComponent,
    AdminComponent,
    DashboardComponent,
    AllUsersComponent,
    BooksComponent,
    EditComponent,
    EditBooksComponent,
    AddBooksComponent,
    MyOrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
