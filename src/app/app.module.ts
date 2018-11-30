import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { CategoryPageModule } from '../pages/category/category.module';
import { SearchPageModule } from '../pages/search/search.module';
import { MypagePageModule } from '../pages/mypage/mypage.module';
import { TabsPage } from '../pages/tabs/tabs';
import { ShoppingbasketPageModule } from '../pages/shoppingbasket/shoppingbasket.module';
import { ProductdetailPageModule } from '../pages/productdetail/productdetail.module';
import { SignupPageModule } from '../pages/signup/signup.module';
import { OrderPageModule } from '../pages/order/order.module';
import { SelectPopoverPageModule } from '../pages/select-popover/select-popover.module';
import { OrderCompletePageModule } from '../pages/order-complete/order-complete.module';
import { OrderDetailPageModule } from '../pages/order-detail/order-detail.module';
import { SignupCompletePageModule } from '../pages/signup-complete/signup-complete.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    CategoryPageModule,
    SearchPageModule,
    MypagePageModule,
    ShoppingbasketPageModule,
    ProductdetailPageModule,
    SignupPageModule,
    OrderPageModule,
    SelectPopoverPageModule,
    OrderCompletePageModule,
    OrderDetailPageModule,
    SignupCompletePageModule,
    IonicModule.forRoot(MyApp,{
      mode:'md',
      scrollPadding: false,
      scrollAssist: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
