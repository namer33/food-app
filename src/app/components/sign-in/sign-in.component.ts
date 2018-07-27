import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  email = '';
  password = '';
  isLogin: Boolean;
  isLoad: boolean;
  isdisabled = '';
  constructor(
    public adminService: AdminService,
    public router: Router,
    public flashMessages: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onSignIn() {
    this.isdisabled = 'true';
    if (this.email === '' || this.password === '') {
      this.isLoad = false;
      this.flashMessages.show('โปรดใส่ข้อมูลให้ครบ!', { cssClass: 'alert-danger', timeout: 2000 });
      setTimeout(() => {
        this.isdisabled = '';
      }, 2100);
      return;
    }
    this.isLoad = true;
    this.adminService.signIn(this.email, this.password)
      .then((res) => {
        this.isLogin = true;
        this.router.navigate(['/admin']);
        this.isLoad = false;
        this.isdisabled = '';
      }).catch((err) => {
        this.isLoad = false;
        this.flashMessages.show(err, { cssClass: 'alert-danger', timeout: 2000 });
        setTimeout(() => {
          this.isdisabled = '';
        }, 2100);
      });
  }


}
