import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../service/delivery.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  deliverys: any[] = [];
  isDelivery = '';
  _length: number;
  i = 0;
  n = 0;
  constructor(
    private router: Router,
    private deliveryService: DeliveryService,
  ) { }

  ngOnInit() {
    this._deliverys();
  }


  _deliverys() {
    this.i = 1;
    this.deliveryService.getAllDeliverys()
      .subscribe(deliverys => {
        this.n++;
        if (deliverys.length === 0) {
          this.isDelivery = '';
          this.i = 0;
          this.n = 0;
          this.deliverys = [];
        } else {
          console.log('n:  ', this.n);
          if (this.n === 1) {
            this._length = deliverys.length;
            this._deliveryBy('desc');
          }
        }
      });
  }


  // this._deliveryBy('desc'); // desc = มากไปน้อย, asc = น้อยไปมาก
  _deliveryBy(value) {
    this.deliveryService._deliveryBy(value)
      .then(() => {
        console.log('a1-length:  ', this._length);
        console.log('deliveryBy.length:  ', this.deliveryService.deliveryBy.length);
        if (this._length === this.deliveryService.deliveryBy.length) {
          this.deliveryService._deliveryAll(this.deliveryService.deliveryBy, this._length)
            .then(() => {
                   console.log('a2-length:  ', this._length);
              //     console.log('a-deliveryAlls.length:  ', this.deliveryService.deliveryAlls.length);
              if (this._length === this.deliveryService.deliveryAlls.length) {
                //    console.log('**-this.i  ', this.i);
                if (this.i === 0) {
                  const d = this.deliveryService.deliveryAlls.pop();
                  this.deliverys = this.deliveryService.deliveryAlls;
                  this.deliverys.unshift(d);
                } else {
                  this.deliverys = this.deliveryService.deliveryAlls;
                }
                this.i = 0;
                this.n = 0;
                this.isDelivery = 'true';
                console.log('3-deliveryBy.length:  ', this.deliveryService.deliveryBy.length);
                console.log('3-deliveryAlls.length:  ', this.deliveryService.deliveryAlls.length);
                console.log('3-this.deliverys.length:', this.deliverys.length);
                console.log('3-this.i  ', this.i);
                console.log('3-this.n  ', this.n);
                console.log('end!');
              }
            });
        }
      });
  }



  deleteDelivery(id) {
    this.deliveryService.deleteDelivery(id);
  }


  viewDelivery(delivery) {
    this.router.navigate(['./details/' + delivery.id])
      .then(() => {
        this.deliverys = [];
      });
  }


}
