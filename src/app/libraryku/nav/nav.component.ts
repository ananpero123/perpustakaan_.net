import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    address: string;
    phone: string;
    role: string;
}

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    isAdmin: boolean = false;
    isLogged: boolean = false;

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router
    ) {}

    ngOnInit() {
        this.afAuth.authState.subscribe(async user => {
            if (user) {
                const firestoreInstance = getFirestore();
                const userDocRef = doc(firestoreInstance, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;
                    this.isLogged = true;

                    if (userData.role === 'admin') {
                        this.isAdmin = true;
                    } else {
                        this.isAdmin = false;
                    }
                }
            } else {
                this.isAdmin = false;
                this.isLogged = false;
            }
        });
    }

    async handleSignOut() {
        if (this.isLogged) {
            try {
                await this.afAuth.signOut();
                this.router.navigate(['/login']);
            } catch (error) {
                console.error('Error during logout:', error);
            }
        } else {
            // Redirect to sign-up or login page
            this.router.navigate(['/signup']); // Change this to the appropriate route
        }
    }
}
