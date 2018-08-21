import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { Admin } from '../../models/interface';
import { FlashMessagesService } from 'angular2-flash-messages';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
  @ViewChild('create') createEl: ElementRef;
  @ViewChild('edit') editEl: ElementRef;
  @ViewChild('del') delEl: ElementRef;
  modalRef: BsModalRef;

  admin: Admin = {
    idAdmin: '',
    email: '',
    password: '',
    fname: '',
    lname: '',
    address: '',
    tel: null,
    date_Signup: '',
    photoURL: '',
  };

  admins: Admin[] = [];
  isUpdate: Boolean;
  isTypePicError: Boolean;
  isError: Boolean;
  textError: any;
  text = false;
  selectedFile: File = null;
  isAdmin = '';
  // var. edit
  id: string;
  email: string;
  password: string;
  fname: string;
  lname: string;
  address: string;
  tel: number;
  url = '';
  flash = '';
  flash2 = '';
  isdisabled = '';
  isLoad: boolean;

  telMask = ['(', /[0-9]/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];


  constructor(
    private modalService: BsModalService,
    private adminService: AdminService,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit() {
    this._admins();

  }


  _admins() {
    this.adminService.getAllAdmins().
      subscribe(admins => {
        if (admins.length === 0) {
          this.isAdmin = '';
        } else {
          this.isAdmin = 'true';
          this.admins = admins;
        }
      });
  }


  addFile(event) {  //  เลือกรูป
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile.type.split('/')[0] !== 'image') {
      // console.error('unsupported file type :( ');
      this.selectedFile = null;
      this.url = null;
      this.flashMessages.show('รูปแบบไฟล์ไม่ถูกต้อง!', { cssClass: 'alert-danger', timeout: 2000 });
      return;
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


  addAdmin() {
    this.isdisabled = '';
    this.flash = 'true';
    this.flash2 = '';
    this.cls();
    this.adminService.getUid();
    console.log('this.admin.email: ' + this.admin.email);
    console.log('createEl');
    this.modalRef = this.modalService.show(this.createEl);
  }


  onClickAddAdmin({ value }: { value: Admin }) {
    this.isdisabled = 'true';
    // tslint:disable-next-line:no-bitwise
    if (this.selectedFile === null || this.admin.email === null || this.admin.password === null
      || this.admin.fname === null || this.admin.lname === null
      || !value.tel || this.admin.address === null
    ) {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    this.isLoad = true;
    this.adminService.signUp(value.email, value.password)
      .then((ref: firebase.User) => {
        //     console.log('ref: ' + JSON.stringify(ref.uid));
        value.idAdmin = ref.uid;
        this.adminService.reSignInAdmins()
          .then(() => {
            this.adminService.uploadFile(this.selectedFile, value)
              .then(() => {
                this.closeModal();
                this.isLoad = false;
              });
          });
      }).catch((err) => {
        console.log('err: ' + err);
        this.isLoad = false;
        this.flashMessages.show(err, { cssClass: 'alert-danger', timeout: 2000 });
        setTimeout(() => {
          this.isdisabled = '';
        }, 2100);
      });
  }



  // ยืนยันการลบ
  delConfirm(value: Admin) {
    this.isLoad = false;
    console.log('value.uid: ' + value.idAdmin);
    this.id = value.idAdmin;
    this.admin = value;
    this.adminService.getUid();
    console.log('delEl');
    this.modalRef = this.modalService.show(this.delEl);
  }


  deleteAdmin() {
    this.isdisabled = 'true';
    this.isLoad = true;
    this.adminService.deleteAdmin(this.id);
    this.adminService.authDelete(this.admin.email, this.admin.password)
      .then(() => {
        this.adminService.reSignInAdmins()
          .then(() => {
            this.modalRef.hide();
            this.isdisabled = '';
            this.isLoad = false;
          });
      });
  }



  // แก้ไข
  editAdmin(admin: Admin) {
    this.isLoad = false;
    this.isdisabled = '';
    this.flash2 = 'true';
    this.flash = '';
    console.log('fname: ' + admin.fname);
    this.adminService.getUid();
    this.admin = admin;
    this.id = admin.idAdmin;
    this.fname = admin.fname;
    this.lname = admin.lname;
    this.email = admin.email;
    this.password = admin.password;
    this.address = admin.address;
    this.tel = admin.tel;
    this.url = admin.photoURL;
    this.selectedFile = null;
    console.log('editEl');
    this.modalRef = this.modalService.show(this.editEl);
  }


  // updateAdmin
  updateAdmin({ value }: { value: Admin }) {
    this.isdisabled = 'true';
    if (this.url === null || this.email === '' || this.password === ''
      || this.fname === '' || this.lname === ''
      || !value.tel || this.address === null
    ) {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    this.isLoad = true;
    value.idAdmin = this.id;
    console.log('this.fname: ' + this.fname);
    console.log('this.selectedFile ' + this.selectedFile);
    if (this.selectedFile == null) {
      console.log('ไม่ได้เปลี่ยนรูป.. ');
      this.adminService.updateAdmin(value);
    } else {
      console.log('เปลี่ยนรูป.. ');
      this.adminService.uploadFile(this.selectedFile, value);
    }
    if (this.email === this.admin.email) {
      console.log('ไม่ได้เปลี่ยนอีเมลล์.. ');
      this.closeModalEdit();
      this.isLoad = false;
      return;
    } else {
      value.email = this.email;
      value.password = this.password;
      console.log('เปลี่ยนอีเมลล์.. ' + value.email + ' | ' + this.admin.email);
      this.adminService.authUpdate(value, this.admin.email, this.admin.password)
        .then((ref) => {
          this.adminService.reSignInAdmins()
            .then(() => {
              this.closeModalEdit();
              this.isLoad = false;
            });
        }).catch((err) => {
          console.log('err ' + err);
          this.isLoad = false;
          this.flashMessages.show(err, { cssClass: 'alert-danger', timeout: 2000 });
          setTimeout(() => {
            this.isdisabled = '';
          }, 2100);
        });
    }
  }


  // call this wherever you want to close modal
  private closeModal(): void {
    console.log('closeModal');
    this.modalRef.hide();
  }


  cls() {
    console.log('cls');
    this.selectedFile = null;
    this.url = '';
    this.admin.email = '';
    this.admin.password = '';
    this.admin.fname = '';
    this.admin.lname = null;
    this.admin.address = null;
    this.admin.tel = null;
    this.admin.photoURL = '';
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
    this.fname = '';
    this.lname = '';
    this.address = '';
    this.tel = null;
  }


}
