import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { SignupPage } from '../signup/signup';

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

  findPage:boolean;
  findCategories = ["아이디 찾기", "비밀번호 찾기"];
  findCategorySelected;
  findLoginInfoMethod;

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App) {
    this.loginTabsSelected = this.loginTabs[0];
    this.findCategorySelected = this.findCategories[0];
  }

  ionViewDidEnter() {
    this.findPage = false;
    this.findLoginInfoMethod = 'phone';
    console.log('ionViewDidLoad MypagePage' + this.findPage);
  }

  loginTabChange(Category){
    let idx = this.loginTabs.indexOf(Category);
    this.loginTabsSelected = this.loginTabs[idx];
  }

  moveToSignup(){
    this.app.getRootNavs()[0].push("SignupPage");
  }

  findCategoryChange(Category) {
    let idx = this.findCategories.indexOf(Category);
    this.findCategorySelected = this.findCategories[idx];
  }

  changeIdPwdFind(type){
    this.findPage=true;
    let idx = this.findCategories.indexOf(type);
    this.findCategorySelected = this.findCategories[idx];
  }

  checkFindLogintype(type){
    this.findLoginInfoMethod = type;
  }
}
