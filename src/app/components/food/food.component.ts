import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FoodService } from '../../service/food.service';
import { Food, Category } from '../../models/interface';
import { FlashMessagesService } from 'angular2-flash-messages';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {
  @ViewChild('create') createEl: ElementRef;
  @ViewChild('edit') editEl: ElementRef;
  @ViewChild('del') delEl: ElementRef;
  modalRef: BsModalRef;

  food: Food = {
    idFood: '',
    date: null,
    name: '',
    price: null,
    detail: '',
    status: null,
    imageUrl: '',
    category: '',
    promotion: null
  };

  categorys: Category[] = [];
  foods: Food[] = [];
  isUpdate: Boolean;
  selectedFile: File = null;
  // var. edit
  id: string;
  name: string;
  price: number;
  detail: string;
  category: string;
  status: boolean;
  nameCategory: string;
  promotion: boolean;
  url = '';
  flash = '';
  flash2 = '';
  isdisabled = '';
  isLoad: boolean;
  isFood = '';
  _length: number;
  setPro = '';
  isDisabled = '';

  constructor(
    private modalService: BsModalService,
    private foodService: FoodService,
    private flashMessages: FlashMessagesService
  ) { }


  ngOnInit() {
    this._foods();
    this._categorys();
  }


  _foods() {
    this.foodService.getAllFoods()
      .subscribe(foods => {
        if (foods.length === 0) {
          this.isFood = '';
          this.foodService.foodBy = [];
          this.foods = [];
        } else {
          this._length = foods.length;
          this._foodBy('desc'); // desc = มากไปน้อย, asc = น้อยไปมาก
        }
      });
  }


  _foodBy(value) {
    this.foodService._foodBy(value)
      .then(() => {
        if (this._length === this.foodService.foodBy.length) {
          this.foods = this.foodService.foodBy;
          this.foodService.foodBy = [];
        }
        this.isFood = 'true';
        console.log('end---foodBy.length:  ', this.foodService.foodBy.length);
      });
  }


  _categorys() {
    this.foodService.getAllCategorys()
      .subscribe(categorys => this.categorys = categorys);
  }



  addFile(event) {  //  เลือกรูป
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile.type.split('/')[0] !== 'image') {
      // console.error('unsupported file type :( ');
      this.selectedFile = null;
      this.url = null;
      this.flashMessages.show('รูปแบบไฟล์ไม่ถูกต้อง!', { cssClass: 'alert-danger', timeout: 2000 });
      return true;
    }
    this.detectFiles(event);
    console.log('event: ' + this.selectedFile.name);
  }

  detectFiles(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  addFood() {
    this.isLoad = false;
    this.isdisabled = '';
    this.flash = 'true';
    this.flash2 = '';
    this.cls();
    console.log('createEl');
    this.modalRef = this.modalService.show(this.createEl);
  }

  onClickAddFood({ value }: { value: Food }) {
    this.isdisabled = 'true';
    // tslint:disable-next-line:no-bitwise
    if (this.selectedFile === null || this.food.name === '' || this.food.price === null
      || this.food.detail === '' || this.food.category === ''
    ) {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    this.isLoad = true;
    this.isUpdate = false;
    console.log('v: ' + value.category);
    value.date = (new Date()).getTime();
    value.promotion = false;
    this.foodService.uploadFile(this.isUpdate, this.selectedFile, value)
      .then(() => {
        this.closeModal();
        this.isLoad = false;
      });
  }


  // ยืนยันการลบ
  delConfirm(value: Food) {
    this.id = value.idFood;
    this.isdisabled = '';
    this.isLoad = false;
    console.log('delEl');
    this.modalRef = this.modalService.show(this.delEl);
  }

  deleteFood() {
    this.isdisabled = 'true';
    this.isLoad = true;
    this.foodService.deleteFood(this.id);
    this.modalRef.hide();
  }


  editFood(food: Food) {
    this.isLoad = false;
    this.isdisabled = '';
    this.flash2 = 'true';
    this.flash = '';
    this.id = food.idFood;
    this.name = food.name;
    this.detail = food.detail;
    this.price = food.price;
    this.category = food.category;
    this.status = food.status;
    this.promotion = food.promotion;
    this.url = food.imageUrl;
    this.selectedFile = null;
    console.log('editEl');
    this.modalRef = this.modalService.show(this.editEl);
  }

  updateFood({ value }: { value: Food }) { // no
    console.log('this.idCategory: ' + this.category);
    this.isdisabled = 'true';
    this.isUpdate = true;
    // tslint:disable-next-line:no-bitwise
    if (this.url === '' || this.name === '' || this.price === null
      || this.detail === '' || this.category === ''
    ) {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    this.isLoad = true;
    value.idFood = this.id;
    console.log('value.id: ' + value.idFood);
    console.log('this.selectedFile ' + this.selectedFile);
    if (this.selectedFile == null) {
      console.log('ไม่ได้เปลี่ยนรูป.. ');
      this.foodService.updateFood(value);
      this.closeModalEdit();
      this.isdisabled = '';
    } else {
      console.log('เปลี่ยนรูป.. ');
      this.isLoad = true;
      this.foodService.uploadFile(this.isUpdate, this.selectedFile, value)
        .then(() => {
          this.closeModalEdit();
          this.isdisabled = '';
        });
    }
  }


  // call this wherever you want to close modal
  private closeModal(): void {
    console.log('closeModal');
    this.modalRef.hide();
    this.cls();
  }


  cls() {
    console.log('cls');
    this.selectedFile = null;
    this.url = '';
    this.food.name = '';
    this.food.price = null;
    this.food.status = false;
    this.food.imageUrl = '';
    this.food.detail = '';
    this.food.category = '';
    this.food.promotion = null;
  }


  private closeModalEdit(): void {
    console.log('closeModaledit');
    this.modalRef.hide();
    this.clsEdit();
  }


  clsEdit() {
    console.log('clsEdit');
    this.selectedFile = null;
    this.url = '';
    this.id = '';
    this.name = '';
    this.price = null;
    this.detail = '';
    this.category = '';
    this.status = null;
    this.promotion = null;
  }

  openPromotion() {
    this.setPro = 'true';
  }

  clsPromotion() {
    this.setPro = '';
  }

  setPromotion(food: Food) {
    this.isDisabled = 'true';
    setTimeout(() => {
      console.log('time');
      this.isDisabled = '';
    }, 1000);
    if (food.promotion) {
      food.promotion = false;
      this.foodService.updateFood(food);
      return true;
    } else {
      food.promotion = true;
      this.foodService.updateFood(food);
    }
  }


}
