import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DeliveryService } from '../../service/delivery.service';
import { OrderService } from '../../service/order.service';
import { AdminService } from '../../service/admin.service';
import { UserService } from '../../service/user.service';
import { Delivery, Order, Admin, User } from '../../models/interface';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SignatureFieldComponent } from '../../signature-field/signature-field.component';
import { resolve, reject } from '../../../../node_modules/@types/q';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {
  @ViewChildren(SignatureFieldComponent) public sigs: QueryList<SignatureFieldComponent>;
  @ViewChildren('sigContainer') public sigContainer: QueryList<ElementRef>;

  public form: FormGroup;
  // for convenience as we don't have a QueryList.index
  public secondSig: SignatureFieldComponent;
  delivery: Delivery = {
    idDelivery: '',
    date: null,
    idOrder: '', // =>
    signature: null,   //  ลายเซ็น
    statusDelivery: ''   //  สถานะการส่ง =>
  };
  isDelivery: string;

  constructor(
    private modalService: BsModalService,
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private adminService: AdminService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      signatureField: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.isDelivery = this.route.snapshot.params['id'];
  }



  // tslint:disable-next-line:use-life-cycle-interface
  public ngAfterViewInit() {
    this.secondSig = this.sigs.find((sig, index) => index === 1);
    this.beResponsive();
    this.setOptions();
    console.log('00: ' + this.sigs.last.signature);
  }

  // set the dimensions of the signature pad canvas
  public beResponsive() {
    console.log('Resizing signature pad canvas to suit container size');
    this.size(this.sigContainer.first, this.sigs.last);
  }

  public size(container: ElementRef, sig: SignatureFieldComponent) {
    sig.signaturePad.set('canvasWidth', container.nativeElement.clientWidth);
    sig.signaturePad.set('canvasHeight', container.nativeElement.clientHeight);
  }

  public setOptions() {
    this.sigs.last.signaturePad.set('penColor', 'rgb(0, 0, 0)');
    this.sigs.last.signaturePad.set('backgroundColor', 'rgb(255, 255, 255)');
    this.sigs.last.signaturePad.clear(); // clearing is needed to set the background colour
  }

  public submit() {
    console.log('CAPTURED SIGS:');
    console.log(this.sigs.last.signature);
    // tslint:disable-next-line:no-shadowed-variable
    this.deliveryService.getOneDelivery(this.isDelivery)
      .subscribe(d => {
        this.delivery = d;
        this.delivery.signature = this.sigs.last.signature;
        this.delivery.statusDelivery = this.deliveryService.status[1];
        this.deliveryService.updateDelivery(this.delivery);
        this.router.navigate(['/admin/delivery/details/' + this.delivery.idDelivery])
        .then(() => {
          this.delivery = null;
        });
      });
  }

  public clear() {
    this.sigs.last.clear();
  }


}
