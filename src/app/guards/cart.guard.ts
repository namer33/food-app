import { Injectable } from '@angular/core';
import { Router, CanActivate, } from '@angular/router';
import { CartService } from '../service/cart.service';


@Injectable()
export class CartGuard implements CanActivate {
  constructor(
    public cartService: CartService,
    public router: Router
  ) { }

  canActivate(): boolean {
    this.cartService.loadCart();
    if (this.cartService.countAll > 0) {
      console.log('isCart: ( ' + this.cartService.countAll);
      return true;
    }
    console.log('2-isCart: ( ' + this.cartService.countAll);
    this.router.navigate(['promotion']);
    return false;
  }
}
