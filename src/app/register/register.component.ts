import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    firstName: string = '';
    lastName: string = '';
    username: string = '';
    email: string = '';
    address: string = '';
    phone: string = '';
    password: string = '';

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router
    ) {}

    async register() {
        try {
            const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
            const userUid = userCredential.user?.uid;

            // Save user data to Firestore with the role "user"
            const firestoreInstance = getFirestore();
            const usersCollectionRef = collection(firestoreInstance, 'users'); // Reference to 'users' collection
            const userDocRef = doc(usersCollectionRef, userUid); // Reference to user document

            await setDoc(userDocRef, {
                firstName: this.firstName,
                lastName: this.lastName,
                username: this.username,
                email: this.email,
                address: this.address,
                phone: this.phone,
                role: 'user'
            });

            // Redirect to user page
            this.router.navigate(['../login']);
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }
}
