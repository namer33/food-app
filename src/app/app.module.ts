import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { TextMaskModule } from 'angular2-text-mask';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SignaturePadModule } from 'angular2-signaturepad';

import { SignatureFieldComponent } from './signature-field/signature-field.component';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AppRoutingModule } from './app-routing.module';

import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { CartGuard } from './guards/cart.guard';

import { AdminService } from './service/admin.service';
import { UserService } from './service/user.service';
import { FoodService } from './service/food.service';
import { OrderService } from './service/order.service';
import { CartService } from './service/cart.service';
import { DeliveryService } from './service/delivery.service';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';

import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { FoodComponent } from './components/food/food.component';
import { UserComponent } from './components/user/user.component';
import { OrderComponent } from './components/order/order.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PromotionComponent } from './components/promotion/promotion.component';
import { FoodListComponent } from './components/food-list/food-list.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { MyCartComponent } from './components/my-cart/my-cart.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { DetailsComponent } from './components/details/details.component';
import { MyOrderComponent } from './components/my-order/my-order.component';
import { NoPageComponent } from './no-page/no-page.component';
import { MyDetailComponent } from './components/my-detail/my-detail.component';
import { AboutComponent } from './components/about/about.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { DeliveryDetailsComponent } from './components/delivery-details/delivery-details.component';
import { SignatureComponent } from './components/signature/signature.component';




@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    AdminComponent,
    HomeComponent,
    FoodComponent,
    UserComponent,
    OrderComponent,
    DeliveryComponent,
    ProfileComponent,
    PromotionComponent,
    FoodListComponent,
    CheckoutComponent,
    MyCartComponent,
    MyAccountComponent,
    DetailsComponent,
    MyOrderComponent,
    NoPageComponent,
    MyDetailComponent,
    AboutComponent,
    AdminListComponent,
    DeliveryDetailsComponent,
    SignatureFieldComponent,
    SignatureComponent
  ],
  imports: [
    ReactiveFormsModule,
    HttpModule,
    SignaturePadModule,
    TextMaskModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,  // offline  // .enablePersistence()
    FlashMessagesModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot()
  ],
  providers: [
    DeliveryService,
    CartService,
    OrderService,
    FoodService,
    UserService,
    AdminService,
    AdminGuard,
    UserGuard,
    CartGuard,
    FlashMessagesService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
