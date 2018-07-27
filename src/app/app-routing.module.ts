import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard } from './guards/admin.guard';
import { CartGuard } from './guards/cart.guard';
import { UserGuard } from './guards/user.guard';

import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { FoodComponent } from './components/food/food.component';
import { OrderComponent } from './components/order/order.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { UserComponent } from './components/user/user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FoodListComponent } from './components/food-list/food-list.component';
import { MyCartComponent } from './components/my-cart/my-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { PromotionComponent } from './components/promotion/promotion.component';
import { DetailsComponent } from './components/details/details.component';
import { MyOrderComponent } from './components/my-order/my-order.component';
import { NoPageComponent } from './no-page/no-page.component';
import { MyDetailComponent } from './components/my-detail/my-detail.component';
import { AboutComponent } from './components/about/about.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { DeliveryDetailsComponent } from './components/delivery-details/delivery-details.component';



const routes: Routes = [
  { path: 'signin', component: SignInComponent, data: { title: 'เข้าสู่ระบบ' } },
  { path: 'signup', component: SignUpComponent, data: { title: 'สมัครสมาชิก' } },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'order',
        pathMatch: 'full'
      },
      {
        path: 'order', // รายการสั่งอาหาร
        component: OrderComponent,
        data: { title: 'รายการสั่งอาหาร' }
      },
      {
        path: 'delivery',  // รายการจัดส่ง
        component: DeliveryComponent,
        data: { title: 'รายการจัดส่ง' }
      },
      {
        path: 'food', // ข้อมูลอาหาร
        component: FoodComponent,
        data: { title: 'ข้อมูลอาหาร' }
      },
      {
        path: 'user', // ข้อมูลลูกค้า
        component: UserComponent,
        data: { title: 'ข้อมูลลูกค้า' }
      },
      {
        path: 'admin-list', // ข้อมูลผู้ดูแลระบบ
        component: AdminListComponent,
        data: { title: 'ข้อมูลผู้ดูแลระบบ' }
      },
      {
        path: 'profile', // ข้อมูลส่วนตัว
        component: ProfileComponent,
        data: { title: 'ข้อมูลส่วนตัว' }
      },
      {
        path: 'order/details/:id',
        component: DetailsComponent,
        data: { title: 'รายละเอียดใบสั่งซื้อ' }
      },
      {
        path: 'delivery/details/:id',
        component: DeliveryDetailsComponent,
        data: { title: 'รายละเอียดการจัดส่ง' }
      }
    ]
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'promotion',
        pathMatch: 'full'
      },
      {
        path: 'promotion',  // โปรโมชัน
        component: PromotionComponent,
        data: { title: 'food shop - ร้านขายอาหารออนไลน์' }
      },
      {
        path: 'food-list',  // รายการอาหาร
        component: FoodListComponent,
        data: { title: 'รายการอาหาร' }
      },
      {
        path: 'about',  //  เกี่ยบกับ
        component: AboutComponent,
        data: { title: 'เกี่ยบกับ' }
      },
      {
        path: '#',
        canActivate: [CartGuard], //  isCart
        children: [
          {
            path: 'my-cart',      // cart
            component: MyCartComponent,
            data: { title: 'ตระกร้าสินค้า' }
          },
          {
            path: 'checkout',     // checkout
            component: CheckoutComponent,
            data: { title: 'ชำระเงิน' }
          }
        ]
      },
      {
        path: 'user',
        canActivate: [UserGuard], // is signin
        children: [
          {
            path: 'my-account',       // ข้อมูลส่วนตัว
            component: MyAccountComponent,
            data: { title: 'ข้อมูลส่วนตัว' }
          },
          {
            path: 'my-order',     // ประวัติการสั่งอาหาร
            component: MyOrderComponent,
            data: { title: 'ประวัติการสั่งอาหาร' }
          },
          {
            path: 'my-order/detail/:id',   // รายละเอียดรายการอาหาร
            component: MyDetailComponent,
            data: { title: 'รายละเอียดรายการอาหาร' }
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'promotion',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
