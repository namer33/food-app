import { Component, OnInit } from '@angular/core';
import { Delivery } from '../../models/interface';
import { DeliveryService } from '../../service/delivery.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  deliverys: Delivery[];
  constructor(
    private router: Router,
    private deliveryService: DeliveryService
  ) { }

  ngOnInit() {
    this._deliverys();
  }


  _deliverys() {
    this.deliveryService.getAllDeliverys().
      subscribe(deliverys => this.deliverys = deliverys);
  }

  deleteDelivery(delivery) {
    this.deliveryService.deleteDelivery(delivery);
  }

  viewDelivery(delivery) {
   // this.router.navigate(['./details/' + delivery.id]);
    this.router.navigate(['./details/' + delivery.id]);

  }


}
