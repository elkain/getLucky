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

  shopTitle: string = "MARKET LUCKY";

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

  findCategories = ["아이디 찾기", "비밀번호 찾기"];
  findCategorySelected;
  findLoginInfoMethod;

  loginStatus:boolean = false;

  showPageType : string;
  showBackbtn: boolean;
  mypageMenus = ["주문내역", "1:1 문의", "공지사항", "회원정보수정", "배송지관리"];

  orderedProducts=[
    { orderedNumber: "20181107123456", productName: "비비고 왕교자 1.05kg 외 3건", productReceiver: "이충민", paymentMethod: "신용카드", price: "35,000원", buyDate: "2018-11-07 17:55", status: "배송완료" },
    { orderedNumber: "20181108589675", productName: "진라면 멀티팩 외 7건", productReceiver: "이충민", paymentMethod: "현장수령", price: "90,000원", buyDate: "2018-11-08 19:20", status: "배송완료" }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App) {
    this.loginTabsSelected = this.loginTabs[0];
    this.findCategorySelected = this.findCategories[0];
  }

  ionViewDidEnter() {
    if (this.loginStatus == true){
      this.showPageType = "mypage";
    }else{
      this.showPageType = "login";
    }

    this.showBackbtn=false;
    
    this.findLoginInfoMethod = 'phone';
    console.log('ionViewDidLoad MypagePage' + this.showPageType);
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

  login(){
    this.loginStatus=true;
    this.showPageType = "mypage";
  }

  changeIdPwdFind(type){
    this.showPageType="find";
    let idx = this.findCategories.indexOf(type);
    this.findCategorySelected = this.findCategories[idx];
  }

  checkFindLogintype(type){
    this.findLoginInfoMethod = type;
  }

  menuSelected(menu){
    this.showPageType=menu;
    this.showBackbtn = true;
  }

  moveToHome() {
    this.navCtrl.parent.select(0);
  }

  goToShoppingBasket(){
    this.navCtrl.parent.select(4);
  }

  back() {
    this.showPageType = "mypage";
    this.showBackbtn = false;
  }
}
