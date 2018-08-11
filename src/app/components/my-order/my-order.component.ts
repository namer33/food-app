import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router';
import { Order } from '../../models/interface';
import { DeliveryService } from '../../service/delivery.service';


@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {
  orders: Order[];
  order: Order;
  isOrder = '';
  _by = 'desc';  // desc = มากไปน้อย, asc = น้อยไปมาก
  _length: number;
  n = 0;
  deliverys: any[] = [];
  _length_d: number;
  i_d = 0;
  n_d = 0;
  isDelivery = '';
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

  viewOrder(order) {
    // this.router.navigate(['./details/' + order.id]);
    this.router.navigate(['./details/' + order.idOrder]);
  }



  // delivery
  _deliverys() {
    this.i_d = 1;
    this.deliveryService.getAllDeliverys()
      .subscribe(deliverys => {
        this.n_d++;
        if (deliverys.length === 0) {
          this.isDelivery = '';
          this.i_d = 0;
          this.n_d = 0;
          this.deliverys = [];
        } else {
          console.log('n_d:  ', this.n_d);
          if (this.n_d === 1) {
            this.n_d++;
            this._length_d = deliverys.length;
            this._deliveryBy('desc');
          }
        }
      });
  }

  _deliveryBy(value) {
    this.deliveryService._deliveryBy_user(value)
      .then(() => {
        console.log('a1-length_d:  ', this._length_d);
        console.log('deliveryBy_user.length:  ', this.deliveryService.deliveryBy_user.length);
        if (this.deliveryService.deliveryBy_user.length) {
          const length = this.deliveryService.deliveryBy_user.length;
          this.deliveryService._deliveryAll_user(this.deliveryService.deliveryBy_user, length)
            .then(() => {
              console.log('a-deliveryAlls-u.length:  ', this.deliveryService.deliveryAlls_user.length);
              if (this.deliveryService.deliveryAlls_user.length) {
                console.log('**-this.i_d  ', this.i_d);
                if (this.i_d === 0) {
                  const d = this.deliveryService.deliveryAlls_user.pop();
                  this.deliverys = this.deliveryService.deliveryAlls_user;
                  this.deliverys.unshift(d);
                  console.log('1-deliverys.length ', this.deliverys.length);
                } else {
                  this.deliverys = this.deliveryService.deliveryAlls_user;
                  console.log('2-deliverys.length ', this.deliverys.length);
                }
                this.i_d = 0;
                this.n_d = 0;
                this.deliveryService.u = 0;
                this.isDelivery = 'true';
                console.log('3-deliveryBy-u.length:  ', this.deliveryService.deliveryBy_user.length);
                console.log('3-deliveryAlls-u.length:  ', this.deliveryService.deliveryAlls_user.length);
                console.log('3-deliverys-.length:', this.deliverys.length);
                console.log('3-this.i_d  ', this.i_d);
                console.log('3-this.n_d  ', this.n_d);
                console.log('3-deliveryService.u  ', this.deliveryService.u);
                console.log('end!');
              }
            });
        }
      });
  }

  viewDelivery(delivery) {
    this.router.navigate(['./details/' + delivery.id])
      .then(() => {
        this.deliverys = [];
      });
  }


}

