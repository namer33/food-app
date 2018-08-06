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
  isOrder: any[] = [];
  orderBy: Order[] = [];
  status =
    [
      'รอการยืนยัน',
      'กำลังเตรียมการ'
    ];

  constructor(
    public afs: AngularFirestore) {
    this.ordersCollection = this.afs.collection('orders', ref => ref);
  }



  _orderBy(value) {
    // เรียงจากน้อยไปมาก
    if (value === 'desc') {
      console.log('_orderBy: desc');
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise((resolve) => {
        this.afs.collection('orders').ref.orderBy('date', 'desc')
          .get()
          .then((result) => {
            result.forEach((doc) => {
              const data = doc.data() as Order;
              //   console.log('date: ', data.date);
              this.orderBy.push(data);
            });
        //    console.log('this.orderBy: ', this.orderBy.length);
        //    console.log('orderDesc: end! ');
            resolve();
          }).catch(function (error) {
            console.log('Error getting documents: ', error);
          });
      });
    }
    // เรียงจากมากไปน้อย
    if (value === 'asc') {
      console.log('_orderBy: asc');
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise((resolve) => {
        this.afs.collection('orders').ref.orderBy('date', 'asc')
          .get()
          .then((result) => {
            result.forEach((doc) => {
              const data = doc.data() as Order;
              //   console.log('date: ', data.date);
              this.orderBy.push(data);
            });
            //   console.log('orderAsc: ', this.orderAsc);
            resolve();
          }).catch(function (error) {
            console.log('Error getting documents: ', error);
          });
      });
    }
  }



  getAllOrders(): Observable<Order[]> {
    console.log('getAllOrders-i: ');
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


  addOrder(value: Order) {
    this.ordersCollection.add(value);
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


  getIdOrder(id: string) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:prefer-const
      let ref = this.afs.collection('orders').ref.where('idOrder', '==', id);
      ref.get().then((result) => {
        result.forEach(doc => {
          // tslint:disable-next-line:prefer-const
          let data = doc.data() as Order;
          console.log(data.total);
          resolve(data);
        });
      });
    });
  }



  // localStorage
  addOrder1(value: Order) {
    console.log('addOrder1');
    if (localStorage.getItem('orders1') == null) {
      const orders1: any = [];
      orders1.push(JSON.stringify(value));
      localStorage.setItem('orders1', JSON.stringify(orders1));
    } else {
      const orders1: any = JSON.parse(localStorage.getItem('orders1'));
      orders1.push(JSON.stringify(value));
      localStorage.setItem('orders1', JSON.stringify(orders1));
    }
    this.loadOrder1();
  }


  loadOrder1(): void {
    this.isOrder = JSON.parse(localStorage.getItem('orders1'));
  }


}
