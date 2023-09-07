import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibrarykuComponent } from './libraryku/libraryku.component';
import { NavComponent } from './libraryku/nav/nav.component';
import { AngularFireModule} from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
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
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { NgModule } from '@angular/core'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { ReadingBooksComponent } from './reading-books/reading-books.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { AngularFireStorageModule} from '@angular/fire/compat/storage';


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
    MyOrdersComponent,
    ReadingBooksComponent,
    PdfViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireStorageModule,
    NgxExtendedPdfViewerModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

