import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { Food } from '../../models/interface';
import { Router } from '@angular/router';
import { HomeComponent } from '../../home/home.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css']
})
export class MyCartComponent implements OnInit {
  @ViewChild('del') delEl: ElementRef;
  modalRef: BsModalRef;
  id;

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    private home: HomeComponent
  ) { }

  ngOnInit() {
    this.cartService.loadCart();
  }



  up(food: Food) { // บวก 1 จำนวน
    console.log(food.idFood);
    this.cartService.addItem(food);
  }


  down(food: Food) {  // ลบ 1 จำนวน
    this.cartService.downCount(food.idFood);
    this.gotoFoodList();
  }


  // ยืนยันการลบ
  delConfirm(value: Food) {
    this.id = value.idFood;
    console.log('delEl');
    this.modalRef = this.modalService.show(this.delEl);

  }


  delete() {  // ลบ 1 รายการ
    this.cartService.remove(this.id);
    this.modalRef.hide();
    this.gotoFoodList();
  }


  gotoFoodList() {
    if (this.cartService.countAll === 0) {
      setTimeout(() => {
        this.router.navigate(['/food-list']);
      }, 1000);
    }
  }


  gotoCheckout() {
    if (this.cartService.countAll === 0) {
      setTimeout(() => {
        this.router.navigate(['/food-list']);
      }, 1000);
    } else {
      this.router.navigate(['/#/checkout']);
    }
  }

}
