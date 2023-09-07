import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  async login() {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      if (userCredential.user) {
        // User successfully logged in, redirect to the desired page
        this.router.navigate(['/Libraryku']);
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle login error here (display error message, etc.)
    }
  }
}
