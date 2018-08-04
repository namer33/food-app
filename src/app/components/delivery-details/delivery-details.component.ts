import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DeliveryService } from '../../service/delivery.service';
import { OrderService } from '../../service/order.service';
import { AdminService } from '../../service/admin.service';
import { UserService } from '../../service/user.service';
import { Delivery, Order, Admin, User } from '../../models/interface';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.css']
})
export class DeliveryDetailsComponent implements OnInit {
  isDelivery: string;

  delivery: Delivery = {
    idDelivery: '',
    date: null,
    idOrder: '', // =>
    signature: null,   //  ลายเซ็น
    statusDelivery: ''   //  สถานะการส่ง =>
  };
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
  isDisabledSignature = '';
  isDisabled = '';

  constructor(
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private adminService: AdminService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getDelivery();
  }


  getDelivery() {
    this.isDelivery = this.route.snapshot.params['id'];
    this.deliveryService.getOneDelivery(this.isDelivery)
      .subscribe(delivery => {
        this.delivery = delivery;
        if (this.delivery.statusDelivery === this.deliveryService.status[2] ||
          this.delivery.statusDelivery === this.deliveryService.status[3]) {
          this.isDisabled = 'true';
        } else {
          this.isDisabled = '';
        }
        this.orderService.getOneOrder(delivery.idOrder)
          .subscribe(order => {
            this.order = order;
            this.adminService.getOneAdmin(order.idUser)
              .subscribe(admin => {
                if (admin) {
                  this.user.fname = admin.fname;
                  this.user.lname = admin.lname;
                  this.user.email = admin.email;
                  this.user.address = admin.address;
                  this.user.tel = admin.tel;
                  this.user.landmarks = '-';
                } else {
                  this.userService.getOneUser(order.idUser)
                    .subscribe(user => {
                      this.user = user;
                    });
                }
              });
          });
      });
  }


  signatureModal() {
    //
  }



  setStatus(s) {
    this.delivery.statusDelivery = s;
    this.isDisabled = 'true';
    this.deliveryService.updateDelivery(this.delivery);
  }


}
