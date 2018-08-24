import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public isLogin: boolean;
  email: string;
  pic: string;
  auth: any;
  constructor(
    private adminService: AdminService
  ) { }


  ngOnInit() {
    this.adminService.getAuth().subscribe(auth => {
      if (auth) {
        this.auth = auth;
        this.adminService.getOneAdmin(auth.uid)
          .subscribe(admin => {
            if (admin) {
              this.email = admin.email;
              this.pic = admin.photoURL;
            }
          });
      }
    });
  }



  signOut() {
    this.adminService.signOut();
  }


}
