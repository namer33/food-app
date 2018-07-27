import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  email = '';
  password = '';
  isLogin: Boolean;
  isLoad: boolean;
  isdisabled = '';

  constructor(
    private adminService: AdminService,
    private router: Router,
    public flashMessages: FlashMessagesService
  ) { }

  ngOnInit() {

  }


  signUp() {
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
    this.adminService.signUp(this.email, this.password)
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


  /*
          // setTimeout 1
        setTimeout(() => {
        console.log('first');  // ไม่ทำงาน
        this.isdisabled = '';  // ทำงาน
        console.log('2this.isdisabled: ' + this.isdisabled);  // ไม่ทำงาน
        }, 2100);

        // setTimeout 1.2
        setTimeout(() => {
          this.dis();  // ทำงานทั้งหมด
        }, 2100);

        dis() {
        console.log('first');
        this.isdisabled = '';
        console.log('2this.isdisabled: ' + this.isdisabled);
        }
  */

}
