import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Order } from '../models/interface';




@Injectable()
export class OrderService {
  ordersCollection: AngularFirestoreCollection<Order>;
  orderDoc: AngularFirestoreDocument<Order>;
  orders: Observable<Order[]>;
  order: Observable<Order>;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  status =
    [
      'รอการยืนยัน',
      'กำลังเตรียมการ',
      'รอการจัดส่ง'
    ];

  constructor(
    public afs: AngularFirestore) {
    this.ordersCollection = this.afs.collection('orders', ref => ref);
  }

  addOrder(value: Order) {
    //  const vv = JSON.stringify(value);
    //  console.log('2-addOrder: ' + vv);
    this.ordersCollection.add(value);
  }

  getAllOrders(): Observable<Order[]> {
    this.orders = this.ordersCollection.snapshotChanges()
      .map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Order;
          data.idOrder = action.payload.doc.id;
          //   console.log('data: ' + data.id);
          this.updateOrder(data);  // add id
          return data;
        });
      });
    return this.orders;
  }

  getOneOrder(idOrder) {
    this.orderDoc = this.afs.doc<Order>(`orders/${idOrder}`);
    this.order = this.orderDoc.snapshotChanges().map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Order;
        data.idOrder = action.payload.id;
        return data;
      }
    });
    return this.order;
  }


  updateOrder(order: Order) {
    this.orderDoc = this.afs.doc(`orders/${order.idOrder}`);
    this.orderDoc.update(order);
  }


  deleteOrder(order: Order) {
    // const _id = JSON.stringify(order);
    // console.log(_id);
    this.orderDoc = this.afs.doc(`orders/${order.idOrder}`);
    this.orderDoc.delete();
  }

}
