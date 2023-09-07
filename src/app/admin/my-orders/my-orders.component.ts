import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, query, where, getDocs, doc, updateDoc } from '@angular/fire/firestore';
import { interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  userOrders: any[] = [];

  constructor(private auth: AngularFireAuth, private firestore: Firestore, private router: Router) {}

  calculateRemainingTime(targetDate: string): string {
    const target = new Date(targetDate);
    const currentTime = new Date();
    const timeDiff = target.getTime() - currentTime.getTime();
    const daysRemaining = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysRemaining < 0) {
      return 'Kedaluwarsa';
    } else {
      return `${daysRemaining} Days`;
    }
  }

  ngOnInit(): void {
    this.auth.authState.subscribe(user => {
      if (user && user.email) {
        const loggedInUserEmail = user.email;
        this.loadUserOrders(loggedInUserEmail);

        // Using interval to update the display every day
        interval(24 * 60 * 60 * 1000).subscribe(() => {
          this.userOrders.forEach(order => {
            const daysRemaining = this.calculateRemainingTime(order.returnDate);
            order.daysRemaining = daysRemaining;

            if (daysRemaining === 'Kedaluwarsa') {
              order.status = 'expired';
              const orderRef = doc(this.firestore, 'orders', order.id);
              updateDoc(orderRef, { status: 'expired' })
                .then(() => {
                  console.log('Status updated to expired in the database');
                })
                .catch(error => {
                  console.error('Error updating status in the database:', error);
                });
            }
          });
        });
      }
    });
  }

  async loadUserOrders(email: string): Promise<void> {
    const ordersCollection = collection(this.firestore, 'orders');
    const ordersQuery = query(ordersCollection, where('email', '==', email));

    try {
      const querySnapshot = await getDocs(ordersQuery);
      this.userOrders = querySnapshot.docs.map(doc => ({
        id: doc.id, // Menyimpan ID dokumen
        ...doc.data(),
        daysRemaining: this.calculateRemainingTime(doc.data()['returnDate'])
      }));
    } catch (error) {
      console.error('Error mengambil pesanan pengguna:', error);
    }
  }

  openPdf(order: any): void {
    if (order && order.id) { // Pastikan order memiliki properti 'id'
      this.router.navigate(['/pdf-viewer', order.id]);
    }
  }

  goToGoogle(link: string): void {
    window.location.href = link;
  }
}
