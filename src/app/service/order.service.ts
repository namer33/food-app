import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Order, User } from '../models/interface';
import { AngularFireAuth } from 'angularfire2/auth';



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
  id: string;
  i = 0;
  status =
    [
      'รอการยืนยัน',
      'กำลังเตรียมการ'
    ];


  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.ordersCollection = this.afs.collection('orders', ref => ref);
  }


  _orderBy(value) {
    this.orderBy = [];
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
              this.orderBy.push(data);
            });
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
              this.orderBy.push(data);
            });
            resolve();
          }).catch(function (error) {
            console.log('Error getting documents: ', error);
          });
      });
    }
  }


  _orderBy_user(value) {
    this.id = this.afAuth.auth.currentUser.uid;
    this.orderBy = [];
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
              //      console.log('id1', this.id);
              //     console.log('id2', data.idUser);
              if (this.id === data.user.idUser) {
                console.log('uu');
                this.orderBy.push(data);
                this.i++;
              }
            });
            resolve(this.i);
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
              //    console.log('id1', this.id);
              //    console.log('id2', data.idUser);
              if (this.id === data.user.idUser) {
                console.log('uu');
                this.orderBy.push(data);
                this.i++;
              }
            });
            resolve(this.i);
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
    console.log('nbnb9999999');
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
