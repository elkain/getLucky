import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCompletePage } from './order-complete';

@NgModule({
  declarations: [
    OrderCompletePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderCompletePage),
  ],
})
export class OrderCompletePageModule {}
