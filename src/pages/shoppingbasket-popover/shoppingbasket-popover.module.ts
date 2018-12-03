import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShoppingbasketPopoverPage } from './shoppingbasket-popover';

@NgModule({
  declarations: [
    ShoppingbasketPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(ShoppingbasketPopoverPage),
  ],
})
export class ShoppingbasketPopoverPageModule {}
