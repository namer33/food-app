import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../service/delivery.service';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { AdminService } from '../../service/admin.service';
import { Delivery } from '../../models/interface';



@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  deliverys: any[] = [];
  isDelivery = '';
  _length: number;
  i = 0;
  n = 0;
  constructor(
    private router: Router,
    private orderService: OrderService,
    private deliveryService: DeliveryService,
    private adminService: AdminService,
    private userService: UserService
  ) { }

  ngOnInit() {
    console.log('00:  ');
    this._deliverys();
  }


  _deliverys() {
    this.n = 1;
    this.deliveryService.getAllDeliverys()
      .subscribe(deliverys => {
        this.i++;
        console.log('11: i ', this.i);
        if (deliverys.length === 0) {
          this.isDelivery = '';
          this.deliverys = [];
          this.i = 0;
        } else {
          if (deliverys.length === 1) {
            this.n = 2;
          }
          if (this.i === 1) {
            this._deliveryBy('desc');
          }
        }
      });
  }


  // this._deliveryBy('desc'); // desc = มากไปน้อย, asc = น้อยไปมาก
  _deliveryBy(value) {
    this.deliveryService._deliveryBy(value)
      .then(() => {
        console.log('-deliveryBy.length:', JSON.stringify(this.deliveryService.deliveryBy.length));
        console.log('-this.deliverys.length:', this.deliverys.length);
        this._loop(this.deliveryService.deliveryBy)
          .then(() => {
            console.log('deliverys.length:', this.deliverys.length);
            console.log('deliveryBy.length:', this.deliveryService.deliveryBy.length);
            console.log('i-:  ', this.i);
            console.log('n-:  ', this.n);
            if (this.n === 0) {
              // tslint:disable-next-line:prefer-const
              let pop = this.deliverys.pop();
              console.log('pop:  ', pop);
              this.deliverys.unshift(pop);
            }
            this.i = 0;
            this.n = 0;
            this.isDelivery = 'true';
            console.log('deliverys.length-pop:  ', this.deliverys.length);
            console.log('i-:  ', this.i);
            console.log('n-:  ', this.n);
          });
      });
  }



  _loop(d) {
    //   console.log('74-this.deliverys:  ', JSON.stringify(this.deliverys));
    this.deliverys = [];
    // tslint:disable-next-line:no-unused-expression
    return new Promise((resolve) => {
      if (d.length === 1 && this.i === 1) {
        const v = d.pop();
        console.log('v:  ', v);
        this.orderService.getOneOrder(v.idOrder)
          .subscribe(order => {
            this.adminService.getOneAdmin(order.idUser)
              .subscribe(admin => {
                if (admin) {
                  this.deliverys.push({
                    id: v.idDelivery,
                    idOrder: v.idOrder,
                    date: v.date,
                    fName: admin.fname,
                    lName: admin.lname,
                    tel: admin.tel,
                    address: admin.address,
                    total: order.total,
                    signature: v.signature,
                    statusDelivery: v.statusDelivery
                  });
                  resolve();
                } else {
                  this.userService.getOneUser(order.idUser)
                    .subscribe(user => {
                      this.deliverys.push({
                        id: v.idDelivery,
                        idOrder: v.idOrder,
                        date: v.date,
                        fName: user.fname,
                        lName: user.lname,
                        tel: user.tel,
                        address: user.address,
                        total: order.total,
                        signature: v.signature,
                        statusDelivery: v.statusDelivery
                      });
                      resolve();
                    });
                }
              });
          });
      } else {
        d.forEach((element: Delivery, i) => {
          this.orderService.getOneOrder(element.idOrder)
            .subscribe(order => {
              this.adminService.getOneAdmin(order.idUser)
                .subscribe(admin => {
                  if (admin) {
                    this.deliverys.push({
                      id: element.idDelivery,
                      idOrder: element.idOrder,
                      date: element.date,
                      fName: admin.fname,
                      lName: admin.lname,
                      tel: admin.tel,
                      address: admin.address,
                      total: order.total,
                      signature: element.signature,
                      statusDelivery: element.statusDelivery
                    });
                    if (d.length === this.deliverys.length) {
                      resolve();
                    }
                  } else {
                    this.userService.getOneUser(order.idUser)
                      .subscribe(user => {
                        this.deliverys.push({
                          id: element.idDelivery,
                          idOrder: element.idOrder,
                          date: element.date,
                          fName: user.fname,
                          lName: user.lname,
                          tel: user.tel,
                          address: user.address,
                          total: order.total,
                          signature: element.signature,
                          statusDelivery: element.statusDelivery
                        });
                        if (d.length === this.deliverys.length) {
                          resolve();
                        }
                      });
                  }
                });
            });
        });
      }
    });
  }



  deleteDelivery(id) {
    this.deliveryService.deleteDelivery(id);
  }


  viewDelivery(delivery) {
    this.router.navigate(['./details/' + delivery.id])
      .then(() => {
        this.deliverys = [];
      });
  }


}
