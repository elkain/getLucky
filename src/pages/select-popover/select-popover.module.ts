import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectPopoverPage } from './select-popover';

@NgModule({
  declarations: [
    SelectPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectPopoverPage),
  ],
})
export class SelectPopoverPageModule {}
