import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router';
import { Order } from '../../models/interface';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DeliveryService } from '../../service/delivery.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @ViewChild('del') delEl: ElementRef;
  modalRef: BsModalRef;
  orders: Order[];
  order: Order;
  isOrder = '';
  _by = 'desc';  // desc = มากไปน้อย, asc = น้อยไปมาก
  _length: number;
  sum = 0;
  _i = 0;
  constructor(
    private modalService: BsModalService,
    private orderService: OrderService,
    private deliveryService: DeliveryService,
    private router: Router,
  ) { }
  ngOnInit() {
    this._orders();
  }


  trackHero(index, hero) {
    console.log(hero);
    return hero ? hero.id : undefined;

  }

  _orders() {
    this.orderService.getAllOrders()
      .subscribe(orders => {
        if (orders.length === 0) {
          this.isOrder = '';
          this.orderService.orderBy = [];
          this.orders = [];
        } else {
          this._length = orders.length;
          this._orderBy(this._by); // desc = มากไปน้อย, asc = น้อยไปมาก
        }
      });
  }


  set_orderBy() {
    if (this._by === 'desc') {
      this._by = 'asc';
      this._orderBy(this._by);
      return;
    }
    if (this._by === 'asc') {
      this._by = 'desc';
      this._orderBy(this._by);
    }
  }


  _orderBy(value) {
    this.orderService._orderBy(value)
      .then(() => {
        if (this._length === this.orderService.orderBy.length) {
          this.orders = this.orderService.orderBy;
          this.orderService.orderBy = [];
          this._index();
        }
        this.isOrder = 'true';
        console.log('end---orderBy.length:  ', this.orderService.orderBy.length);
      });
  }


  _index() {
    this.orders.forEach((order, i) => {
      if (order.statusOrder === this.orderService.status[0]) {
        this._i++;
        console.log('_i:  ', this._i);
      }
    });

  }


  // ยืนยันการลบ
  delConfirm(value: Order) {
    console.log('value.uid: ' + value.idOrder);
    this.order = value;
    console.log('delEl');
    this.modalRef = this.modalService.show(this.delEl);
  }


  deleteOrder(order) {
    this.orderService.deleteOrder(order);
    //  this.modalRef.hide();
  }

  viewOrder(order) {
    // this.router.navigate(['./details/' + order.id]);
    this.router.navigate(['./details/' + order.idOrder]);

  }


}
