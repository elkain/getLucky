import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  titleColor = "#3498DB";
  whiteColor = "#ffffff";

  emailOption;
  sex;
  male;
  female;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.male = this.whiteColor;
    this.female = this.whiteColor;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  emailOptionChange(){
    
  }

  selectMale(){
    this.sex = "male";
    this.male = this.titleColor;
    this.female = this.whiteColor;
  }

  selectFemale(){
    this.sex = "female";
    this.male = this.whiteColor;
    this.female = this.titleColor;
  }


  signupCompBtn(){
    this.navCtrl.setRoot(TabsPage, { tabIndex: 7 });
  }
}
