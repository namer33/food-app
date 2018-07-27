import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { AdminService } from '../../service/admin.service';
import { Order } from '../../models/interface';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  idOrder: string;

  order: Order = {
    idOrder: '',
    date: null,
    foods: null, // รายการอาหาร
    count: null,  // จำนวนรายการอาหารทั้งหมด
    total: null,     // จำนวนเงินทั้งหมด
    payment: '',  // -- วิธีชำระเงิน
    idUser: '',
    statusOrder: ''
  };
  constructor(
    private orderService: OrderService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getOrder();
  }


  getOrder() {
    this.idOrder = this.route.snapshot.params['id'];
    this.orderService.getOneOrder(this.idOrder).subscribe(order => this.order = order);
  }


}
