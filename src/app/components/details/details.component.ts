import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { AdminService } from '../../service/admin.service';
import { Order, Delivery, User, Food } from '../../models/interface';
import { UserService } from '../../service/user.service';
import { FoodService } from '../../service/food.service';
import { DeliveryService } from '../../service/delivery.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  idOrder: string;
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
    idOrder: '', // =>
    signature: null,   //  ลายเซ็น
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
    this.getOrder();
  }


  getOrder() {
    this.idOrder = this.route.snapshot.params['id'];
    this.orderService.getOneOrder(this.idOrder)
      .subscribe(order => {
        if (order.statusOrder === this.orderService.status[2]) {
          this.isDisabled = 'true';
        } else {
          this.isDisabled = '';
        }
        this.order = order;
        this.getUser(this.order.idUser);
        this.foods = order.foods;
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


  changeStatus(value) {
    if (value.statusOrder === this.orderService.status[0]) {
      this.order.idOrder = value.idOrder;
      this.order.statusOrder = this.orderService.status[1];
      this.orderService.updateOrder(this.order);
      this.isDisabled = '';
      return;
    }
    if (value.statusOrder === this.orderService.status[1]) {
      this.order.idOrder = value.idOrder;
      this.order.statusOrder = this.orderService.status[2];
      this.orderService.updateOrder(this.order);
      this.isDisabled = '';
      this.delivery.idOrder = value.idOrder;
      this.delivery.statusDelivery = this.deliveryService.status[0];
      this.deliveryService.addDelivery(this.delivery);
      return;
    }
  }


}
