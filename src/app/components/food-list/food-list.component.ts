import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../service/food.service';
import { CartService } from '../../service/cart.service';
import { Food } from '../../models/interface';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css']
})
export class FoodListComponent implements OnInit {
  foods: Food[];
  constructor(
    private foodService: FoodService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this._foods();
  }

  _foods() {
    this.foodService.getAllFoods().
      subscribe(foods => this.foods = foods);
  }

  addItem(value: Food) {
    console.log(value.idFood);
    this.cartService.addItem(value);
  }

}
