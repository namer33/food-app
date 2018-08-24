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
  foods: Food[] = [];
  i = 0;
  constructor(
    private foodService: FoodService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.getFoods();
  }

  getFoods() {
    this.foodService.getAllFoods().
      subscribe(foods => {
        this.i++;
        if (this.i === 1) {
          this.foods = [];
          foods.forEach(food => {
            if (food.status) {
              this.foods.push(food);
            }
          });
          this.i = 0;
        }
      });
  }

  addItem(value: Food) {
    console.log(value.idFood);
    this.cartService.addItem(value);
  }

}
