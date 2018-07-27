import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DeliveryService } from '../../service/delivery.service';
import { AdminService } from '../../service/admin.service';
import { Delivery } from '../../models/interface';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.css']
})
export class DeliveryDetailsComponent implements OnInit {
  isDelivery: string;
  delivery: Delivery = {
    idDelivery: '',
    idOrder: '', // =>
    signature: null,   //  ลายเซ็น
    statusDelivery: ''   //  สถานะการส่ง =>
  };
  constructor(
    private deliveryService: DeliveryService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getDelivery();
  }


  getDelivery() {
    this.isDelivery = this.route.snapshot.params['id'];
    this.deliveryService.getOneDelivery(this.isDelivery).subscribe(delivery => this.delivery = delivery);
  }

}
