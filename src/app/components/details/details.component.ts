import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, Delivery, Food, User } from '../../models/interface';
import { DeliveryService } from '../../service/delivery.service';
import { OrderService } from '../../service/order.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  idOrder: string;
  user: User = {
    idUser: '',
    email: '',
    password: '',
    fname: '',
    lname: '',
    address: '',
    landmarks: '',   ///  จุดสังเกต
    tel: null,
    date_Signup: '',
    photoURL: '',
  };
  order: Order = {
    idOrder: '',
    date: null,
    foods: null,  // รายการอาหารทั้งหมด =>
    count: null,  // จำนวนรายการอาหารทั้งหมด
    total: null,     // จำนวนเงินทั้งหมด
    payment: '',  // -- วิธีชำระเงิน
    user: null, // =>   // ลูกค้า =>
    statusOrder: null
  };
  delivery: Delivery = {
    idDelivery: '',
    date: null,
    order: null, // =>
    signature: '',   //  ลายเซ็น
    statusDelivery: null,
  };
  foods: Food[] = [];
  isDisabled = '';

  constructor(
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getOrder();
  }


  getOrder() {
    this.idOrder = this.route.snapshot.params['id'];
    this.orderService.getOneOrder(this.idOrder)
      .subscribe(order => {
        if (order) {
          this.order = order;
          this.user = order.user;
          this.foods = order.foods;
        }
      });
  }


  changeStatus(order) {
    this.order.idOrder = order.idOrder;
    if (this.order.statusOrder === this.orderService.status[0]) {
      this.order.statusOrder = this.orderService.status[1];
      this.orderService.updateOrder(this.order);
      this.isDisabled = 'true';
      setTimeout(() => {
        console.log('time');
        this.isDisabled = '';
      }, 3000);
      return true;
    }
    if (this.order.statusOrder === this.orderService.status[1]) {
      this.order.idOrder = order.idOrder;
      this.order.statusOrder = this.deliveryService.status[0];
      this.orderService.updateOrder(this.order);
      this.addDelivery(order);
      this.isDisabled = 'true';
      setTimeout(() => {
        console.log('time');
        this.isDisabled = '';
      }, 3000);
    }
  }


  addDelivery(order) {
    this.delivery.date = (new Date()).getTime();
    this.delivery.order = order;
    this.delivery.statusDelivery = this.deliveryService.status[0];
    this.deliveryService.addDelivery(this.delivery);
  }


  clsOrder(order) {
      this.order.idOrder = order.idOrder;
      this.order.statusOrder = this.orderService.status[2];
      this.orderService.updateOrder(this.order);
      this.isDisabled = 'true';
      setTimeout(() => {
        console.log('time');
        this.isDisabled = '';
      }, 3000);
    }



}
