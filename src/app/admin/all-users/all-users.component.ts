import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  orders: any[] = []; 
  selectedOrder: any = null; 
  allowModalVisible: boolean = true;
  returnModalVisible: boolean = false;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.loadOrdersData();   }

  async loadOrdersData(): Promise<void> {
    const ordersCollection = collection(this.firestore, 'orders');
    try {
      const querySnapshot = await getDocs(ordersCollection); 
      querySnapshot.forEach((doc) => {
        this.orders.push({ id: doc.id, ...doc.data() }); 
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  openModal(order: any, modalType: string) {
    this.selectedOrder = order;
    if (modalType === 'allow') {
      this.allowModalVisible = true;
    } else if (modalType === 'return') {
      this.returnModalVisible = true;
    }
  }
  
  

  async updateLoanStatus() {
    if (this.selectedOrder) {
      const orderId = this.selectedOrder.id; 
      const orderRef = doc(this.firestore, 'orders', orderId); 
      const updatedStatus = 'approve'; 
      try {
        await updateDoc(orderRef, { status: updatedStatus });
        console.log(`AutoId ${orderId}: Success update status`);
        this.selectedOrder.status = updatedStatus; 
        this.allowModalVisible = false; // Setelah tindakan selesai, sembunyikan modal
        this.returnModalVisible = true;
        location.reload(); 

      } catch (error) {
        console.error('Error updating loan status:', error);
      }
    }
  }

  async deleteOrder() {
    if (this.selectedOrder) {
      const orderId = this.selectedOrder.id;
      const orderRef = doc(this.firestore, 'orders', orderId);
  
      try {
        await deleteDoc(orderRef);
  
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          this.orders.splice(orderIndex, 1);
        }
  
        console.log(`AutoId ${orderId}: Success delete order`);
        this.selectedOrder = null; 
        location.reload(); 
      } catch (error) { 
        console.error('Error deleting order:', error);
      }
    }
  }



    async confirmReturn() {
      if (this.selectedOrder) {
        const orderId = this.selectedOrder.id;
        const orderRef = doc(this.firestore, 'orders', orderId);
        const updatedStatus = 'returned';
        
        try {
          await updateDoc(orderRef, { status: updatedStatus });
          console.log(`AutoId ${orderId}: Success update status to returned`);
          this.selectedOrder.status = updatedStatus;
          this.returnModalVisible = false; // Setelah tindakan selesai, sembunyikan modal
          location.reload(); 


        } catch (error) {
          console.error('Error updating status to returned:', error);
        }
      }
    }
}
