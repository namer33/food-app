import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../service/delivery.service';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router';
import { Delivery, Order } from '../../models/interface';
import { UserService } from '../../service/user.service';
import { AdminService } from '../../service/admin.service';


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  deliverys: any[] = [];
  id: string[] = [];
  date: number[] = [];
  fName: string[] = [];
  lName: string[] = [];
  tel: number[] = [];
  address: string[] = [];
  total: number[] = [];    // จำนวนเงินทั้งหมด
  signature: any[] = [];
  statusDelivery: string[] = [];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private deliveryService: DeliveryService,
    private adminService: AdminService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this._deliverys();
  }


  _deliverys() {
    this.deliveryService.getAllDeliverys()
      .subscribe(deliverys => {
        this._loop(deliverys);
      });
  }


  _loop(d) {
    d.forEach((element, i) => {
      return new Promise((resolve, reject) => {
        this.id.push(element.idDelivery);
        this.date.push(element.date);
        this.signature.push(element.signature);
        this.statusDelivery.push(element.statusDelivery);
        this.orderService.getOneOrder(element.idOrder)
          .subscribe(order => {
            this.total.push(order.total);
            this.adminService.getOneAdmin(order.idUser)
              .subscribe(admin => {
                if (admin) {
                  this.fName.push(admin.fname);
                  this.lName.push(admin.lname);
                  this.address.push(admin.address);
                  this.tel.push(admin.tel);
                  resolve();
                } else {
                  this.userService.getOneUser(order.idUser)
                    .subscribe(user => {
                      this.fName.push(user.fname);
                      this.lName.push(user.lname);
                      this.address.push(user.address);
                      this.tel.push(user.tel);
                      resolve();
                    });
                }
              });
          });
      })
        .then(() => {
          this.deliverys.push({
            id: this.id[i],
            date: this.date[i],
            fName: this.fName[i],
            lName: this.lName[i],
            tel: this.tel[i],
            address: this.address[i],
            total: this.total[i],
            signature: this.signature[i],
            statusDelivery: this.statusDelivery[i]
          });
          console.log('033: ' + i + ' ' + JSON.stringify(this.deliverys.length));
          console.log('044: ' + i + ' ' + JSON.stringify(this.deliverys));
        });
    });
  }


  deleteDelivery(delivery) {
    this.deliveryService.deleteDelivery(delivery);
  }


  viewDelivery(delivery) {
    // this.router.navigate(['./details/' + delivery.id]);
    this.router.navigate(['./details/' + delivery.id]);

  }


}
