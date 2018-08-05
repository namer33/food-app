import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { CartService } from '../service/cart.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('auth') authEl: ElementRef;
  modalRef: BsModalRef;

  isLogin: Boolean;
  userEmail: string;
  email = '';
  password = '';
  isLoad: boolean;
  isdisabled = '';

  constructor(
    private modalService: BsModalService,
    private userService: UserService,
    private adminService: AdminService,
    private cartService: CartService,
    public router: Router,
    private flashMessages: FlashMessagesService
  ) { }



  ngOnInit() {
    this.userService.getAuth().subscribe(auth => {
      if (auth) {
        this.adminService.getOneAdmin(auth.uid)
          .subscribe(admin => {
            if (admin) {
              this.userEmail = admin.email;
            } else {
              this.userService.getOneUser(auth.uid)
                .subscribe(user => {
                  this.userEmail = user.email;
                });
            }
          });
      }
    });
    this.userService.userState();
    this.cartService.loadCart();
  }



  openAuthModal() {
    console.log('authEl');
    this.modalRef = this.modalService.show(this.authEl);
  }



  onSignUp() {
    this.isdisabled = 'true';
    if (this.email === '' || this.password === '') {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    this.isLoad = true;
    this.userService.signUp(this.email, this.password)
      .then((res) => {
        this.modalRef.hide();
        this.isLoad = false;
        this.isdisabled = '';
      }).catch((err) => {
        this.isLoad = false;
        this.flashMessages.show(err, { cssClass: 'alert-danger', timeout: 2000 });
        setTimeout(() => {
          this.isdisabled = '';
        }, 2100);
      });
  }


  onSignIn() {
    this.isdisabled = 'true';
    if (this.email === '' || this.password === '') {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    this.isLoad = true;
    this.userService.signIn(this.email, this.password)
      .then((res) => {
        this.modalRef.hide();
        this.isLoad = false;
        this.isdisabled = '';
      }).catch((err) => {
        this.isLoad = false;
        this.flashMessages.show(err, { cssClass: 'alert-danger', timeout: 2000 });
        setTimeout(() => {
          this.isdisabled = '';
        }, 2100);
      });
  }



  onSignOut() {
    this.userService.signOut();
    this.userService.userState();
  }



}
