import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { Admin } from '../../models/interface';
import { FlashMessagesService } from 'angular2-flash-messages';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('edit') editEl: ElementRef;
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

  isTypePicError: Boolean;
  isError: Boolean;
  textError: any;
  text = false;
  selectedFile: File = null;
  isAdmin = '';
  // var. edit
  email: string;
  password: string;
  url = '';
  isdisabled = '';
  isLoad: boolean;

  telMask = ['(', /[0-9]/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private modalService: BsModalService,
    private adminService: AdminService,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit() {
    this.adminService.getAuth()
      .subscribe(auth => {
        if (auth) {
          this.adminService.getOneAdmin(auth.uid)
            .subscribe(admin => {
              this.admin = admin;
            });
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


  // แก้ไข
  editAdmin(admin: Admin) {
    this.isLoad = false;
    this.isdisabled = '';
    this.selectedFile = null;
    this.email = this.admin.email;
    this.password = this.admin.password;
    this.url = this.admin.photoURL;
    this.modalRef = this.modalService.show(this.editEl);
  }


  // updateAdmin
  updateAdmin({ value }: { value: Admin }) {
    this.isdisabled = 'true';

    if (!this.url || !this.email || !this.password
      || !value.tel || !this.admin.address
      || !this.admin.fname || !this.admin.lname
    ) {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    console.log('this.admin.tel ' + this.admin.tel);
    this.isLoad = true;
    value.idAdmin = this.admin.idAdmin;
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
          this.adminService.email = value.email;
          this.closeModalEdit();
          this.isLoad = false;
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


  private closeModalEdit(): void {
    console.log('closeModaledit');
    this.modalRef.hide();
    this.clsEdit();
  }


  clsEdit() {
    console.log('clsEdit');
    this.selectedFile = null;
    this.url = null;
  }



}
