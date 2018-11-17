import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShoppingbasketPage } from './shoppingbasket';

@NgModule({
  declarations: [
    ShoppingbasketPage,
  ],
  imports: [
    IonicPageModule.forChild(ShoppingbasketPage),
  ],
})
export class ShoppingbasketPageModule {}
