import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore } from '@angular/fire/firestore';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  userUid: string | null = null;
  username: string = '';
  imageProfile: string | undefined;
  isAdmin: boolean = false;
  orders: any[] = []; // Menyimpan data pesanan
  userOrders: any[] = []; // Menyimpan data pesanan relevan dengan pengguna

  constructor(private afAuth: AngularFireAuth, private firestore: Firestore) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
        const firestoreInstance = getFirestore();
        const userDocRef = doc(firestoreInstance, 'users', this.userUid);

        getDoc(userDocRef).then((userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data() as any;
            this.username = userData.username;
            this.imageProfile = userData.imageProfile;
            this.isAdmin = userData.role === 'admin';

            if (this.isAdmin) {
              // Mengambil pesanan dengan status 'pending'
              const ordersCollection = collection(firestoreInstance, 'orders');
              const ordersQuery = query(ordersCollection, where('status', '==', 'pending'));
              getDocs(ordersQuery).then(querySnapshot => {
                this.orders = querySnapshot.docs.map(doc => doc.data());
              });
            } else {
              // Mengambil pesanan yang relevan dengan pengguna yang sedang masuk
              const userOrdersCollection = collection(firestoreInstance, 'orders');
              const userOrdersQuery = query(userOrdersCollection, where('username', '==', this.username));
              getDocs(userOrdersQuery).then(querySnapshot => {
                this.userOrders = querySnapshot.docs.map(doc => doc.data());

                // Periksa perubahan status dan ubah notifikasi sesuai
                this.userOrders.forEach(order => {
                  if (order.status === 'approve' && !order.confirmationMessage) {
                    order.confirmationMessage = `Meminjam Buku "${order.bookTitle}" sudah di konfirmasi`;
                  }
                });
              });
            }
          }
        });
      }
    });
  }
}
