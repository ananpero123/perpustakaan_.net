import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-reading-books',
  templateUrl: './reading-books.component.html',
  styleUrls: ['./reading-books.component.css']
})
export class ReadingBooksComponent implements OnInit {
  pdfData: string | undefined;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit(): Promise<void> {
    const orderId = this.route.snapshot.params['orderId'];
    const orderDocRef = doc(this.firestore, 'orders', orderId);

    try {
      const orderDocSnapshot = await getDoc(orderDocRef);
      if (orderDocSnapshot.exists()) {
        const orderData = orderDocSnapshot.data();
        if (orderData && orderData['bookPdf']) {
          this.pdfData = orderData['bookPdf'];
          console.log('PDF Data (base64):', this.pdfData);
        } else {
          console.log('PDF data not found in order');
        }
      } else {
        console.log('Order document not found');
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  }
}
