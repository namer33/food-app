import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public isLogin: boolean;
  public userEmail: string;
  constructor(
    private adminService: AdminService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.adminService.getAuth().subscribe(auth => {
      if (auth) {
        this.adminService.email = auth.email;
      }
    });
  }



  signOut() {
    this.adminService.signOut();
  }


}
