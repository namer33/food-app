import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../service/delivery.service';
import { Router } from '@angular/router';
import { Delivery, User, Order } from '../../models/interface';



@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  deliverys: Delivery[];
  user: User;
  order: Order;
  isDelivery = '';
  _length: number;
  i = 0;
  n = 0;
  constructor(
    private router: Router,
    private deliveryService: DeliveryService,
  ) { }

  ngOnInit() {
    this._deliverys();
  }


  _deliverys() {
    this.i = 1;
    this.deliveryService.getAllDeliverys()
      .subscribe(deliverys => {
        this.n++;
        if (deliverys.length === 0) {
          this.isDelivery = '';
          this.i = 0;
          this.n = 0;
          this.deliverys = [];
        } else {
          this._length = deliverys.length;
          this._deliveryBy('desc');
        }
      });
  }


  // this._deliveryBy('desc'); // desc = มากไปน้อย, asc = น้อยไปมาก
  _deliveryBy(value) {
    this.deliveryService._deliveryBy(value)
      .then(() => {
        if (this._length === this.deliveryService.deliveryBy.length) {
          this.deliverys = this.deliveryService.deliveryBy;
          this.deliveryService.deliveryBy = [];
        }
        this.isDelivery = 'true';
        console.log('end---orderBy.length:  ', this.deliveryService.deliveryBy.length);
      });
  }


}
