import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../models/interface';
import { FlashMessagesService } from 'angular2-flash-messages';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('create') createEl: ElementRef;
  @ViewChild('edit') editEl: ElementRef;
  @ViewChild('del') delEl: ElementRef;
  modalRef: BsModalRef;
  isUser = '';
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
    landmarks: ''   ///  จุดสังเกต
  };


  users: User[] = [];
  isUpdate: Boolean;
  isTypePicError: Boolean;
  isError: Boolean;
  textError: any;
  text = false;
  selectedFile: File = null;

  // var. edit
  id: string;
  email: string;
  password: string;
  fname: string;
  lname: string;
  address: string;
  landmarks: string;
  tel: number;
  url = '';
  flash = '';
  flash2 = '';
  isdisabled = '';
  isLoad: boolean;

  telMask = ['(', /[0-9]/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];


  constructor(
    private modalService: BsModalService,
    private userService: UserService,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit() {
    this._users();

  }


  _users() {
    this.userService.getAllUsers().
      subscribe(users => {
        if (users.length === 0) {
          this.isUser = '';
        } else {
          this.isUser = 'true';
          this.users = users;
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


  addUser() {
    this.isdisabled = '';
    this.flash = 'true';
    this.flash2 = '';
    this.cls();
    this.userService.getUid();
    console.log('this.user.email: ' + this.user.email);
    console.log('createEl');
    this.modalRef = this.modalService.show(this.createEl);
  }


  onClickAddUser({ value }: { value: User }) {
    this.isdisabled = 'true';
    // tslint:disable-next-line:no-bitwise
    if (this.selectedFile === null || this.user.email === null || this.user.password === null
      || this.user.fname === null || this.user.lname === null
      || !value.tel || this.user.address === null || !value.landmarks
    ) {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    this.isLoad = true;
    this.userService.signUp(value.email, value.password)
      .then((ref: firebase.User) => {
        //      console.log('ref: ' + ref);
        value.idUser = ref.uid;
        this.userService.reSignInAdmins()
          .then(() => {
            this.userService.uploadFile(this.selectedFile, value)
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
  delConfirm(value: User) {
    console.log('value.uid: ' + value.idUser);
    this.id = value.idUser;
    this.user = value;
    this.userService.getUid();
    console.log('delEl');
    this.modalRef = this.modalService.show(this.delEl);
  }


  deleteUser() {
    this.isdisabled = 'true';
    this.isLoad = true;
    this.userService.deleteUser(this.id);
    this.userService.authUserDelete(this.user.email, this.user.password)
      .then(() => {
        this.userService.reSignInAdmins()
          .then(() => {
            this.modalRef.hide();
            this.isdisabled = '';
            this.isLoad = false;
          });
      });
  }



  // แก้ไข
  editUser(user: User) {
    this.isdisabled = '';
    this.flash2 = 'true';
    this.flash = '';
    console.log('fname: ' + user.fname);
    this.userService.getUid();
    this.user = user;
    this.id = user.idUser;
    this.fname = user.fname;
    this.lname = user.lname;
    this.email = user.email;
    this.password = user.password;
    this.address = user.address;
    this.tel = user.tel;
    this.url = user.photoURL;
    this.selectedFile = null;
    console.log('editEl');
    this.modalRef = this.modalService.show(this.editEl);
  }


  // updateUser
  updateUser({ value }: { value: User }) {
    this.isdisabled = 'true';
    if (this.url === null || this.email === '' || this.password === ''
      || this.fname === '' || this.lname === ''
      || !value.tel || this.address === null || !value.landmarks
    ) {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    this.isLoad = true;
    value.idUser = this.id;
    console.log('this.fname: ' + this.fname);
    console.log('this.selectedFile ' + this.selectedFile);
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
      this.userService.authUserUpdate(value, this.user.email, this.user.password)
        .then((ref) => {
          this.userService.reSignInAdmins()
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
    this.user.email = '';
    this.user.password = '';
    this.user.fname = '';
    this.user.lname = null;
    this.user.address = null;
    this.user.tel = null;
    this.user.photoURL = '';
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
