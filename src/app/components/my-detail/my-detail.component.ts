import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { Order, Delivery, User, Food } from '../../models/interface';
import { DeliveryService } from '../../service/delivery.service';


@Component({
  selector: 'app-my-detail',
  templateUrl: './my-detail.component.html',
  styleUrls: ['./my-detail.component.css']
})
export class MyDetailComponent implements OnInit {

  id: string;
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
  isStatus = '';

  constructor(
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getID();
  }


  getID() {
    this.id = this.route.snapshot.params['id'];
    this.orderService.getOneOrder(this.id)
      .subscribe(order => {
        if (order) {
          this.isStatus = 'order';
          this.order = order;
          this.user = order.user;
          this.foods = order.foods;
        } else {
          this.deliveryService.getOneDelivery(this.id)
            .subscribe(delivery => {
              if (delivery) {
                this.isStatus = 'delivery';
                this.delivery = delivery;
                this.order = delivery.order;
                this.user = delivery.order.user;
              }
            });
        }
      });
  }



}

