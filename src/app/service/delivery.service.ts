import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Delivery } from '../models/interface';
import { OrderService } from './order.service';


@Injectable()
export class DeliveryService {
  deliverysCollection: AngularFirestoreCollection<Delivery>;
  deliveryDoc: AngularFirestoreDocument<Delivery>;
  deliverys: Observable<Delivery[]>;
  delivery: Observable<Delivery>;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  deliveryBy: Delivery[] = [];
  status =
    [
      'รอการจัดส่ง',
      'รับสินค้าแล้ว',
      'ไม่รับสินค้า',
      'ติดต่อไม่ได้'
    ];
  idOrder;
  constructor(
    private orderService: OrderService,
    public afs: AngularFirestore) {
    this.deliverysCollection = this.afs.collection('deliverys', ref => ref);
  }


  _deliveryBy(value) {
    // เรียงจากน้อยไปมาก
    if (value === 'desc') {
      console.log('_deliveryBy: desc');
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise((resolve) => {
        this.afs.collection('orders').ref.orderBy('date', 'desc')
          .get()
          .then((result) => {
            result.forEach((doc) => {
              const data = doc.data() as Delivery;
              //   console.log('date: ', data.date);
              this.deliveryBy.push(data);
            });
        //    console.log('this.deliveryBy: ', this.deliveryBy.length);
        //    console.log('orderDesc: end! ');
            resolve();
          }).catch(function (error) {
            console.log('Error getting documents: ', error);
          });
      });
    }
    // เรียงจากมากไปน้อย
    if (value === 'asc') {
      console.log('_deliveryBy: asc');
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise((resolve) => {
        this.afs.collection('orders').ref.orderBy('date', 'asc')
          .get()
          .then((result) => {
            result.forEach((doc) => {
              const data = doc.data() as Delivery;
              //   console.log('date: ', data.date);
              this.deliveryBy.push(data);
            });
            //   console.log('orderAsc: ', this.orderAsc);
            resolve();
          }).catch(function (error) {
            console.log('Error getting documents: ', error);
          });
      });
    }
  }



  getAll(): Observable<Delivery[]> {
    this.deliverysCollection.snapshotChanges()
      .map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Delivery;
      //    this.orderService.getOneOrder(data.idOrder); // => order
          this.idOrder = data.idOrder;
          return data.idOrder;
        });
      });
    return this.idOrder;
  }


  addDelivery(value: Delivery) {
    const vv = JSON.stringify(value);
    console.log('2-addDelivery: ' + vv);
    this.deliverysCollection.add(value);
    this.getAllDeliverys().subscribe();
  }


  getAllDeliverys(): Observable<Delivery[]> {
    this.deliverys = this.deliverysCollection.snapshotChanges()
      .map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Delivery;
          data.idDelivery = action.payload.doc.id;
          this.updateDelivery(data); // add id
          return data;
        });
      });
    return this.deliverys;
  }


  getOneDelivery(idDelivery) {
    this.deliveryDoc = this.afs.doc<Delivery>(`deliverys/${idDelivery}`);
    this.delivery = this.deliveryDoc.snapshotChanges().map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Delivery;
        data.idDelivery = action.payload.id;
        return data;
      }
    });
    return this.delivery;
  }


  updateDelivery(delivery: Delivery) {
    this.deliveryDoc = this.afs.doc(`deliverys/${delivery.idDelivery}`);
    this.deliveryDoc.update(delivery);
  }


  deleteDelivery(delivery: Delivery) {
    // const _id = JSON.stringify(delivery);
    // console.log(_id);
    this.deliveryDoc = this.afs.doc(`deliverys/${delivery.idDelivery}`);
    this.deliveryDoc.delete();
  }

}
