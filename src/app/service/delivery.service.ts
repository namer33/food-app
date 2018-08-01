import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Delivery } from '../models/interface';




@Injectable()
export class DeliveryService {
  deliverysCollection: AngularFirestoreCollection<Delivery>;
  deliveryDoc: AngularFirestoreDocument<Delivery>;
  deliverys: Observable<Delivery[]>;
  delivery: Observable<Delivery>;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  status =
    [
      'รอการจัดส่ง',
      'รับสินค้าแล้ว',
      'ไม่รับสินค้า',
      'ติดต่อไม่ได้'
    ];

  constructor(
    public afs: AngularFirestore) {
    this.deliverysCollection = this.afs.collection('deliverys', ref => ref);
  }


  addDelivery(value: Delivery) {
    const vv = JSON.stringify(value);
    console.log('2-addDelivery: ' + vv);
    this.deliverysCollection.add(value);
    this.getAllDeliverys().subscribe(() => { });
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
