import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public isLogin: boolean;
  public userName: string;
  public userEmail: string;
  public userPicture: string;
  public userId: string;
  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.adminService.getAuth().subscribe( auth => {
      if (auth) {
        this.isLogin = true;
        this.userName = auth.displayName;
        this.userEmail = auth.email;
        this.userPicture = auth.photoURL;
        this.userId = auth.uid;
      } else {
        this.isLogin = false;
      }
    });
  }

  signOut() {
    this.adminService.signOut();
  }


}
