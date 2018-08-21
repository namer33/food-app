import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../service/food.service';
import { CartService } from '../../service/cart.service';
import { Food } from '../../models/interface';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
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
    this.foodService.getAllFoods()
      .subscribe(foods => {
        this.i++;
        if (this.i === 1) {
          this.foods = [];
          foods.forEach(food => {
            if (food.promotion) {
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
