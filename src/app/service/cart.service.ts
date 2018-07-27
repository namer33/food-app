import { Injectable } from '@angular/core';
import { Food } from '../models/interface';


@Injectable()
export class CartService {
  delivery_charge: number;  // ค่าจัดส่ง
  items: any[];
  countAll: number;
  total: number;
  constructor() { }


  addItem(value: Food) {
    if (value.idFood) {
      const food: any = {
        idFood: value.idFood,
        name: value.name,
        price: value.price,
        imageUrl: value.imageUrl
      };
      const item: any = {
        product: food,
        count: 1,
        delivery_charge: 40  // ค่าจัดส่ง
      };
      if (localStorage.getItem('cart') == null) {
        const cart: any = [];
        cart.push(JSON.stringify(item));
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        const cart: any = JSON.parse(localStorage.getItem('cart'));
        let index = -1;
        for (let i = 0; i < cart.length; i++) {
          // tslint:disable-next-line:prefer-const
          // tslint:disable-next-line:no-shadowed-variable
          const item: any = JSON.parse(cart[i]);
          // console.log(item.product.id + ' | ' + item.n);
          if (item.product.idFood === value.idFood) {
            // tslint:disable-next-line:no-shadowed-variable
            index = i;
            break;
          }
        }
        if (index === -1) {
          cart.push(JSON.stringify(item));
          localStorage.setItem('cart', JSON.stringify(cart));
        } else {
          // tslint:disable-next-line:no-shadowed-variable
          const item: any = JSON.parse(cart[index]);
          item.count += 1;
          cart[index] = JSON.stringify(item);
          localStorage.setItem('cart', JSON.stringify(cart));
        }
      }
      this.loadCart();
    } else {
      this.loadCart();
    }
  }

  loadCart(): void {
    this.items = [];
    this.countAll = 0;
    this.total = 0;
    this.delivery_charge = 0;
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        const item = JSON.parse(cart[i]);
        this.items.push({
          product: item.product,
          count: item.count
        });
        this.total += item.product.price * item.count;
        this.countAll += item.count;
        this.delivery_charge = item.delivery_charge;
      }
    }
  }


  downCount(id: string): void {  // ลบ 1 จำนวน
    // tslint:disable-next-line:prefer-const
    let cart: any = JSON.parse(localStorage.getItem('cart'));
    // tslint:disable-next-line:prefer-const
    for (let i = 0; i < cart.length; i++) {
      // tslint:disable-next-line:prefer-const
      let item: any = JSON.parse(cart[i]);
      if (item.product.idFood === id) {
        if (item.count === 1) {
          cart.splice(i, 1);
        } else {
          item.count--;
          cart[i] = JSON.stringify(item);
        }
        break;
      }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    this.loadCart();

  }


  remove(id: string): void {  // ลบ 1 รายการ
    const cart: any = JSON.parse(localStorage.getItem('cart'));
    // tslint:disable-next-line:prefer-const
    let index = -1;
    for (let i = 0; i < cart.length; i++) {
      const item: any = JSON.parse(cart[i]);
      if (item.product.idFood === id) {
        cart.splice(i, 1);
        break;
      }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    this.loadCart();

  }

  removeAll() { // ลบทั้งหมด
    this.items = [];
    this.countAll = 0;
    this.total = 0;
    this.delivery_charge = 0;
    localStorage.setItem('cart', JSON.stringify([]));
  }


}
