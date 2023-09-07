import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import hanya yang diperlukan

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any = null; // Sesuaikan dengan struktur data pengguna

  constructor(private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const db = getFirestore(); // Dapatkan akses ke Firestore
        const userDocRef = doc(db, 'users', user.uid);

        getDoc(userDocRef).then(userDoc => {
          if (userDoc.exists()) {
            this.user = userDoc.data();
          }
        });
      }
    });
  }
}
