import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router';
import { Order } from '../../models/interface';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


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
  i = 0;
  constructor(
    private modalService: BsModalService,
    private orderService: OrderService,
    private router: Router,
  ) { }
  ngOnInit() {
    this._orders();
  }


  _orders() {
    this.orderService.getAllOrders()
      .subscribe(orders => {
        if (orders.length === 0) {
          this.isOrder = '';
        } else {
          this.isOrder = 'true';
        }
        this.orders = orders;
        console.log('orders.length:  ', orders.length);
        console.log('orderBy.length:  ', this.orderService.orderBy.length);
        console.log('i:  ', this.i);
        if (orders.length > this.orderService.orderBy.length && this.i === 0) {
          this._orderBy();
          this.i++;
        }
      });
  }


  _orderBy() {
    console.log('nnn ');
    this.orderService._orderBy('desc'); // desc = >, asc = <
  }


  // ยืนยันการลบ
  delConfirm(value: Order) {
    console.log('value.uid: ' + value.idOrder);
    this.order = value;
    console.log('delEl');
    this.modalRef = this.modalService.show(this.delEl);
  }


  deleteOrder() {
    this.orderService.deleteOrder(this.order);
    this.modalRef.hide();
  }

  viewOrder(order) {
    // this.router.navigate(['./details/' + order.id]);
    this.router.navigate(['./details/' + order.idOrder]);

  }


}
