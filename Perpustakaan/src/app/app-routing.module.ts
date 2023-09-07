import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrarykuComponent } from './libraryku/libraryku.component';
import { HomeComponent } from './libraryku/home/home.component';
import { EksploreComponent } from './libraryku/eksplore/eksplore.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SaveBookComponent } from './libraryku/save-book/save-book.component';
import { AdminComponent } from './admin/admin.component';
import { AllUsersComponent } from './admin/all-users/all-users.component';
import { EditComponent } from './admin/edit/edit.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { BooksComponent } from './admin/books/books.component';
import { EditBooksComponent } from './admin/edit-books/edit-books.component';
import { AddBooksComponent } from './admin/add-books/add-books.component';
import { UserComponent } from './Users/user.component';
import { EditsComponent } from './Users/edits/edits.component';
import { HomeusersComponent } from './Users/homeusers/homeusers.component';
import { MyOrderComponent } from './Users/my-order/my-order.component';
import { ProtectGuard } from './guards/protect.guard';

const routes: Routes = [
  { path: '', redirectTo: '/Libraryku/home', pathMatch: 'full' },
  { path: 'Libraryku', redirectTo: '/Libraryku/home', pathMatch: 'full' },
  {
    path: 'Libraryku',
    component: LibrarykuComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'eksplore',  component: EksploreComponent },
      { path: 'save_book/:id', canActivate: [ProtectGuard], component: SaveBookComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    canActivate: [ProtectGuard],
    component: AdminComponent,
    children: [
      { path: 'all-users', component: AllUsersComponent },
      { path: 'edit', component: EditComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'books', component: BooksComponent },
      { path: 'edit_books/:id', component: EditBooksComponent },
      { path: 'add_books', component: AddBooksComponent },
    ],
  },
  {
    path: 'users',
    canActivate: [ProtectGuard],
    component: UserComponent,
    children: [
      { path: 'edits', component: EditsComponent },
      { path: 'dashboard', component: HomeusersComponent },
      { path: 'my_orders', component: MyOrderComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
