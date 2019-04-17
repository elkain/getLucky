import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticePopoverPage } from './notice-popover';

@NgModule({
  declarations: [
    NoticePopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticePopoverPage),
  ],
})
export class NoticePopoverPageModule {}
