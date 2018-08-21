import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router';
import { Order, Delivery } from '../../models/interface';
import { DeliveryService } from '../../service/delivery.service';


@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {
  _by = 'desc';  // desc = มากไปน้อย, asc = น้อยไปมาก
  deliverys: Delivery[];
  orders: Order[];
  order: Order;
  isOrder = '';
  isDelivery = '';
  _length: number;
  _length_d: number;
  n = 0;
  n_d = 0;
  v = true;


  constructor(
    private orderService: OrderService,
    private deliveryService: DeliveryService,
    private router: Router,
  ) { }
  ngOnInit() {
    this._orders();
    this._deliverys();
  }



  // order
  _orders() {
    this.orderService.getAllOrders()
      .subscribe(orders => {
        this.n++;
        if (orders.length === 0) {
          this.isOrder = '';
          this.orderService.orderBy = [];
          this.orders = [];
        } else {
          if (this.n === 1) {
            this._length = orders.length;
            this._orderBy(this._by); // desc = มากไปน้อย, asc = น้อยไปมาก
          }
        }
      });
  }

  _orderBy(value) {
    this.orderService._orderBy_user(value)
      .then((i) => {
        console.log('length:  ', this._length);
        console.log('i  ', i);
        console.log('orderBy.length:  ', this.orderService.orderBy.length);
        if (this.orderService.orderBy.length) {
          this.orders = this.orderService.orderBy;
          this.orderService.orderBy = [];
        }
        this.isOrder = 'true';
        this.n = 0;
        this.orderService.i = 0;
        console.log('end---orderBy.length:  ', this.orderService.orderBy.length);
        console.log('n  ', this.n);
        console.log('orderService.i  ', this.orderService.i);
      });
  }


  // delivery
  _deliverys() {
    this.deliveryService.getAllDeliverys()
      .subscribe(deliverys => {
        this.n_d++;
        if (deliverys.length === 0) {
          this.isOrder = '';
          this.deliveryService.deliveryBy = [];
          this.deliverys = [];
        } else {
          if (this.n_d === 1) {
            this._length_d = deliverys.length;
            this._deliveryBy(this._by); // desc = มากไปน้อย, asc = น้อยไปมาก
          }
        }
      });
  }

  _deliveryBy(value) {
    this.deliveryService._deliveryBy_user(value)
      .then((i) => {
        console.log('length_d:  ', this._length_d);
        console.log('i  ', i);
        console.log('deliveryBy.length:  ', this.deliveryService.deliveryBy.length);
        if (this.deliveryService.deliveryBy.length) {
          this.deliverys = this.deliveryService.deliveryBy;
          this.deliveryService.deliveryBy = [];
        }
        this.isDelivery = 'true';
        this.n_d = 0;
        this.deliveryService.i = 0;
        console.log('end---deliveryBy.length:  ', this.deliveryService.deliveryBy.length);
        console.log('n_d  ', this.n_d);
        console.log('deliveryService.i  ', this.deliveryService.i);
      });
  }

}

