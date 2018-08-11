import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { AdminService } from '../../service/admin.service';
import { Order, Delivery, User, Food } from '../../models/interface';
import { UserService } from '../../service/user.service';
import { FoodService } from '../../service/food.service';
import { DeliveryService } from '../../service/delivery.service';


@Component({
  selector: 'app-my-detail',
  templateUrl: './my-detail.component.html',
  styleUrls: ['./my-detail.component.css']
})
export class MyDetailComponent implements OnInit {

  id: string;
  order: Order = {
    idOrder: '',
    date: null,
    foods: null, // รายการอาหาร
    count: null,  // จำนวนรายการอาหารทั้งหมด
    total: null,     // จำนวนเงินทั้งหมด
    payment: '',  // -- วิธีชำระเงิน
    idUser: '',
    statusOrder: ''
  };
  order1: Order = {
    idOrder: '',
    date: null,
    foods: null, // รายการอาหาร
    count: null,  // จำนวนรายการอาหารทั้งหมด
    total: null,     // จำนวนเงินทั้งหมด
    payment: '',  // -- วิธีชำระเงิน
    idUser: '',
    statusOrder: ''
  };
  user: User = {
    idUser: '',
    email: '',
    password: '',
    fname: '',
    lname: '',
    address: '',
    tel: null,
    date_Signup: '',
    photoURL: '',
    landmarks: ''   ///  จุดสังเกต
  };
  delivery: Delivery = {
    idDelivery: '',
    date: null,
    idOrder: '', // =>
    idUser: '', // =>
    signature: '',   //  ลายเซ็น
    statusDelivery: ''
  };
  foods: Food[] = [];
  deliverys: Delivery[] = [];
  isDisabled = '';

  constructor(
    private deliveryService: DeliveryService,
    private foodService: FoodService,
    private userService: UserService,
    private orderService: OrderService,
    private adminService: AdminService,
    private router: Router,
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
          this.order = order;
          this.getUser(order.idUser);
          this.foods = order.foods;
        } else {
          this.deliveryService.getOneDelivery(this.id)
            .subscribe(delivery => {
              if (delivery) {
                this.delivery = delivery;
                this.getUser(delivery.idUser);
                this.orderService.getOneOrder(delivery.idOrder)
                  .subscribe(order1 => {
                    this.order1 = order1;
                  });
              }
            });
        }
      });
  }


  getUser(id) {
    this.userService.getOneUser(id)
      .subscribe(user => {
        if (user) {
          this.user = user;
        } else {
          this.adminService.getOneAdmin(id)
            .subscribe(admin => {
              if (admin) {
                this.user.fname = admin.fname;
                this.user.lname = admin.lname;
                this.user.tel = admin.tel;
                this.user.email = admin.email;
                this.user.address = admin.address;
                this.user.landmarks = '-';
              } else {
                this.user.fname = '-';
                this.user.lname = '-';
                this.user.tel = 0;
                this.user.email = '-';
                this.user.address = '-';
                this.user.landmarks = '-';
              }
            });
        }
      });
  }




}

