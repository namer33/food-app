import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { User, Admin } from '../../models/interface';
import { FlashMessagesService } from 'angular2-flash-messages';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  @ViewChild('edit') editEl: ElementRef;
  modalRef: BsModalRef;
  user: User = {
    idUser: '',
    email: '',
    password: '',
    fname: '',
    lname: '',
    address: '',
    tel: null,
    date_Signup: '',
    photoURL: '',
    landmarks: ''
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
    private userService: UserService,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit() {
    this.adminService.getAuth()
      .subscribe(auth => {
        if (auth) {
          this.adminService.getOneAdmin(auth.uid)
            .subscribe(admin => {
              if (admin) {
                this.user.email = admin.email;
                this.user.password = admin.password;
                this.user.photoURL = admin.photoURL;
                this.user.fname = admin.fname;
                this.user.lname = admin.lname;
                this.user.address = admin.address;
                this.user.tel = admin.tel;
                this.user.landmarks = '-';
              } else {
                this.userService.getOneUser(auth.uid)
                  .subscribe(user => this.user = user);
              }
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
  editUser() {
    this.isLoad = false;
    this.isdisabled = '';
    this.selectedFile = null;
    this.email = this.user.email;
    this.password = this.user.password;
    this.url = this.user.photoURL;
    this.modalRef = this.modalService.show(this.editEl);
  }


  // update
  update({value}: {value: User}) {
    this.isdisabled = 'true';
    if (!this.url || !value.email
      || !value.tel || !value.address
      || !value.fname || !value.lname || !value.landmarks
    ) {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    this.isLoad = true;
    this.adminService.getOneAdmin(this.user.idUser)
      .subscribe(admin => {
        if (admin) {
          this._admin(value);
        } else {
          this.userService.getOneUser(this.user.idUser)
            .subscribe(user => {
              this._user(value);
            });
        }
      });
  }


  _admin(value) {
    value.idAdmin = this.user.idUser;
    if (this.selectedFile == null) {
      console.log('ไม่ได้เปลี่ยนรูป.. ');
      this.adminService.updateAdmin(value);
    } else {
      console.log('เปลี่ยนรูป.. ');
      this.adminService.uploadFile(this.selectedFile, value);
    }
    if (this.email === this.user.email) {
      console.log('ไม่ได้เปลี่ยนอีเมลล์.. ');
      this.closeModalEdit();
      this.isLoad = false;
      return;
    } else {
      value.email = this.email;
      value.password = this.password;
      console.log('เปลี่ยนอีเมลล์.. ' + value.email + ' | ' + this.user.email);
      this.adminService.authUpdate(value, this.user.email, this.user.password)
        .then((ref) => {
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


  _user(value) {
    value.idUser = this.user.idUser;
    if (this.selectedFile == null) {
      console.log('ไม่ได้เปลี่ยนรูป.. ');
      this.userService.updateUser(value);
    } else {
      console.log('เปลี่ยนรูป.. ');
      this.userService.uploadFile(this.selectedFile, value);
    }
    if (this.email === this.user.email) {
      console.log('ไม่ได้เปลี่ยนอีเมลล์.. ');
      this.closeModalEdit();
      this.isLoad = false;
      return;
    } else {
      value.email = this.email;
      value.password = this.password;
      console.log('เปลี่ยนอีเมลล์.. ' + value.email + ' | ' + this.user.email);
      this.userService.authUpdate(value, this.user.email, this.user.password)
        .then((ref) => {
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

