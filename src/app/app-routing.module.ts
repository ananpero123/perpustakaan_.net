import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrarykuComponent } from './libraryku/libraryku.component';
import { HomeComponent } from './libraryku/home/home.component';
import { EksploreComponent } from './libraryku/eksplore/eksplore.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SaveBookComponent } from './libraryku/save-book/save-book.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {path: '', redirectTo: '/Libraryku/home', pathMatch: 'full'},
  {path: 'Libraryku', redirectTo: '/Libraryku/home', pathMatch: 'full'},
  {path: 'Libraryku', component:LibrarykuComponent, children: [
    {path: 'home', component:HomeComponent},
    {path: 'eksplore', component:EksploreComponent},
    {path: 'save_book', component:SaveBookComponent},
  ]},
  {path: 'register', component:LoginComponent},
  {path: 'login', component:RegisterComponent},
  {path: 'admin', component:AdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
