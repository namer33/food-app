import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from '../../service/delivery.service';
import { Delivery, Order, User } from '../../models/interface';


@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.css']
})
export class DeliveryDetailsComponent implements OnInit {

  isDelivery: string;
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
  isDisabledSignature = '';
  isDisabled = '';
  isSignature = '';

  constructor(
    private deliveryService: DeliveryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit() {
    this.getDelivery();
  }

  getDelivery() {
    this.isDelivery = this.route.snapshot.params['id'];
    this.deliveryService.getOneDelivery(this.isDelivery)
      .subscribe(delivery => {
        if (delivery) {
          this.delivery = delivery;
          this.order = delivery.order;
          this.user = delivery.order.user;
          if (this.delivery.signature === '') {
            this.isDisabledSignature = '';
            if (this.delivery.statusDelivery !== this.deliveryService.status[0]) {
              this.isDisabled = 'true';
            }
          } else {
            this.isDisabledSignature = 'true';
            this.isDisabled = 'true';
          }
        }
      });
  }

  setStatus(s) {
    this.delivery.statusDelivery = s;
    this.isDisabled = 'true';
    this.deliveryService.updateDelivery(this.delivery);
  }


  signature() {
    this.router.navigate(['/admin/delivery/details/' + this.delivery.idDelivery + '/signature'])
      .then(() => {
        this.delivery = null;
      });
  }


}
