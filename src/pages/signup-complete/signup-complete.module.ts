import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupCompletePage } from './signup-complete';

@NgModule({
  declarations: [
    SignupCompletePage,
  ],
  imports: [
    IonicPageModule.forChild(SignupCompletePage),
  ],
})
export class SignupCompletePageModule {}
