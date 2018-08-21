import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { Order, User } from '../../models/interface';
import { FlashMessagesService } from 'angular2-flash-messages';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AdminService } from '../../service/admin.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('confirm') confirmEl: ElementRef;
  modalRef: BsModalRef;

  orders: Order[];
  isLoad: boolean;
  isdisabled = '';
  isNull = '';
  order: Order = {
    idOrder: '',
    date: null,
    foods: null, // รายการอาหาร
    count: null,  // จำนวนรายการอาหารทั้งหมด
    total: null,     // จำนวนเงินทั้งหมด
    payment: '',  // -- วิธีชำระเงิน
    user: null,
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

  telMask = ['(', /[0-9]/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // totalMask = [/[0-9]/, ',', /\d/, /\d/, ',', /\d/, /\d/, /\d/];

  constructor(
    private afAuth: AngularFireAuth,
    private modalService: BsModalService,
    private userService: UserService,
    private adminService: AdminService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    public flashMessages: FlashMessagesService,
  ) { }

  ngOnInit() {
    this.cartService.loadCart();
    this._oneUser();
  }

  _orders() {
    this.orderService.getAllOrders()
      .subscribe(orders => this.orders = orders);
  }

  _oneUser() {
    const id = this.afAuth.auth.currentUser.uid;
    this.userService.getOneUser(id)
      .subscribe(user => {
        if (user) {
          this.user = user;
        } else {
          this.adminService.getOneAdmin(id)
            .subscribe(admin => {
              if (admin) {
                this.user.idUser = admin.idAdmin;
                this.user.fname = admin.fname;
                this.user.lname = admin.lname;
                this.user.tel = admin.tel;
                this.user.address = admin.address;
                this.user.email = admin.email;
                this.user.photoURL = admin.photoURL;
                this.user.landmarks = '-';
              }
            });
        }
        console.log('user000: ', this.user);
      });
  }


  myConfirm() {
    this.isdisabled = 'true';
    if (this.user.fname === '' || this.user.lname === ''
      || this.user.tel == null || this.user.address === ''
      || this.user.landmarks === '') {
      console.log('01');
      this.isNull = 'true';
      setTimeout(() => {
        this.isNull = '';
        this.isdisabled = '';
      }, 2000);
      return;
    } else {
      console.log('confirmEl');
      this.modalRef = this.modalService.show(this.confirmEl);
      this.isdisabled = '';
    }
  }


  onClickAddOrder(user: User) {
    user.idUser = this.afAuth.auth.currentUser.uid;
    this.modalRef.hide();
    this.isLoad = true;
    this.order.user = user;
    console.log('uuu: ', this.order.user);
    //    return true;
    this.order.date = (new Date()).getTime();
    this.order.foods = this.cartService.items;
    this.order.count = this.cartService.countAll;
    this.order.total = this.cartService.total + this.cartService.delivery_charge;
    this.order.payment = 'เงินสด (จ่ายเมื่อรับสินค้า)';
    this.order.statusOrder = this.orderService.status[0];

    if (this.order.count > 0) {
      this.orderService.addOrder(this.order);
      this._orders();   //  addID
      this.cartService.removeAll();
      this.cartService.loadCart();
      setTimeout(() => {
        this.router.navigate(['/user/my-order']);
        this.isLoad = false;
      }, 1000);
    } else {
      console.log('ไม่มีรายการสั่งอาหาร! ');
      this.isLoad = false;
      return;
    }

  }

}
