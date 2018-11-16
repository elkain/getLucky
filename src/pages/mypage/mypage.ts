import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MypagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MypagePage {

  loginTabs = ["회원", "비회원"];
  loginTabsSelected;

  username: string;
  password: string;

  usernamePlaceHolder: string = "아이디";
  passwordPlaceHolder: string = "비밀번호";

  orderName:string;
  orderNumber:string;

  orderNamePlaceHolder: string = "주문자명";
  orderNumberPlaceHolder: string = "주문번호";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loginTabsSelected = this.loginTabs[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MypagePage');
  }

  loginTabChange(Category){
    let idx = this.loginTabs.indexOf(Category);
    this.loginTabsSelected = this.loginTabs[idx];
  }
}
